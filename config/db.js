const mysql = require("mysql2")
const {Sequelize,DataTypes,Model,Op} = require('sequelize')

const sequelize = new Sequelize('yike','root','147258',{
    port:3306,
    host:'localhost',
    dialect:'mysql'
});


(async ()=>{
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功~');
    } catch (error) {
        console.error('不能连接到数据库:', error);
    }
})()

module.exports = sequelize;

