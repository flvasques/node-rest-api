const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = null;

if(process.env.DB_TYPE == 'MYSQL') {
    sequelize = new Sequelize(process.env.DATA_BASE, process.env.DB_USER, process.env.PASSWORD, {
        dialect: 'mysql',
        pool: {
           max: 1,
           min: 1,
           idel: 10000
       }
   });
} else {
    sequelize = new Sequelize('sqlite::memory:');
}


module.exports = sequelize;
