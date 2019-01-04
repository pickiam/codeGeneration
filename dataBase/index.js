
// let db = require('./db.js');
// function transformStr(str){
//     var re=/_(\w)/g;
//     return str.replace(re,function ($0,$1){
//         return $1.toUpperCase();
//     });
// }
// db.sequelize.query("select COLUMN_NAME, column_comment from information_schema.columns where table_name = 'cs_order_info'").then((res) => {
//     let columnArr = [];
//     for (let index of res[0]) {
//         let column = Object.values(index);
//         columnArr.push(column);
//     }
//     for (let index of columnArr) {
//         index[0] = transformStr(index[0]);
//     }
//     return columnArr;
// })
