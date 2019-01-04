let fs = require('fs');
let pug = require('pug');
let pathNode = require('path');
// let dbIndex = require('./dataBase/index')
let basePath = pathNode.resolve(__dirname, '..', 'page');
// 文件路径
let cptName = process.argv.splice(2);
// 数据库名
let dbName = cptName[2] || 'changantp_sys';
// 数据库表名
let dbTableName = cptName[1];
let path = cptName[0].split('/');
let name = path[path.length - 1];
let dir = path[path.length - 2];
let initdir = path[path.length - 3];
let template = ['./template/template.pug', './template/template.vue'];
let inputFile = [`${basePath}/${initdir}/${dir}/${name}/${name}.vue`, `${basePath}/${initdir}/${dir}/${name}/fields.js`];
let db = require('./dataBase/db.js');
function transformStr (str) {
    var re = /_(\w)/g;
    return str.replace(re, function ($0, $1) {
        return $1.toUpperCase();
    });
};
let data;
class BaseFunc {
    // 检测目标文件夹是否存在
    exists () {
        return new Promise(async (resolve, reject) => {
            for (let index of path) {
                fs.existsSync(`${basePath}/${index}`) ? basePath = `${basePath}/${index}` : basePath = await this.mkdir(index);
            }
            resolve(basePath);
        });
    }
    // 创建目标文件夹
    mkdir (index) {
        return new Promise((resolve, reject) => {
            fs.mkdir(`${basePath}/${index}`, (err) => {
                if (err) reject(err);
                basePath = `${basePath}/${index}`;
                resolve(basePath);
            });
        });
    }
    // 读取模板文件
    readTemplate () {
        return new Promise((resolve, reject) => {
            let readPug, readVue;
            for (let index of template) {
                // 如果是pug文件
                if (index.indexOf('.pug') > 0) {
                    readPug = () => {
                        return new Promise((resolve, reject) => {
                            db.sequelize.query(`select COLUMN_NAME, column_comment from information_schema.columns where table_name = "${dbTableName}" and TABLE_SCHEMA = "${dbName}"`).then((res) => {
                                let columnArr = [];
                                for (let index of res[0]) {
                                    let column = Object.values(index);
                                    columnArr.push(column);
                                }
                                for (let index of columnArr) {
                                    index[0] = transformStr(index[0]);
                                }
                                data = {dataArr: columnArr};
                                let fn = pug.compileFile(index, {pretty: true});
                                resolve(fn(data).replace('="v-else"', '').replace('="long"', '').replace('="divided"', '').replace('="show-total"', '').replace('="show-elevator"', '').replace('="show-sizer"', '').replace(/="clearable"/g, '').replace('="inline"', ''));
                            });
                        });
                    };
                } else if (index.indexOf('.vue') > 0) {
                    readVue = () => {
                        return new Promise((resolve, reject) => {
                            let readVueResult = fs.readFileSync(index);
                            resolve(readVueResult);
                        });
                    };
                }
            }
            Promise.all([readPug(), readVue()]).then((res) => {
                resolve(res[0] + '\n' + res[1]);
            });
        });
    }
    // 写入目标文件
    writeTargetFile (args) {
        return new Promise((resolve, reject) => {
            for (let index of inputFile) {
                if (index.indexOf('.vue') > 1) {
                    fs.writeFileSync(index, args);
                } else if (index.indexOf('.js') > 1) {
                    const tmpl = addInfos => `export const fields = {
                        ${addInfos.map(addInfo =>
                            `'${addInfo[0]}': {
                                title: '${addInfo[1]}',
                                key: '${addInfo[0]}',
                                sortable: 'custom',
                                ellipsis: true,
                                width: 120
                            }`
                        )}
                    };`;
                    fs.writeFileSync(index, tmpl(data.dataArr));
                }
            }
        });
    }
}
async function create () {
    try {
        let fn = new BaseFunc();
        // 同步函数加上await ,后面代码不执行
        await fn.exists();
        let response = await fn.readTemplate();
        await fn.writeTargetFile(response);
        process.exit(1);
    } catch (error) {
        console.error(error);
    }
}
create();
