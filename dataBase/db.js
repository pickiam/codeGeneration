
const Sequelize = require('sequelize');
const sequelize = new Sequelize('changantp_sys', '***', 'ywc@2018', {
    host: '121.43.56.25',
    port: '3322',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
sequelize.authenticate().then(() => {
    console.log('数据库连接成功');
}).catch((err) => {
    console.err(err);
});
exports.sequelize = sequelize;
