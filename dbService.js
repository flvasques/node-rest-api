const mySql = require('mysql2');
const env = require('./env');
const { Sequelize, DataTypes } = require('sequelize');


const connection = mySql.createConnection(env.optConect);

const sequelize = new Sequelize(env.optConect.database, env.optConect.user, env.optConect.password, {
     dialect: 'mysql',
     pool: {
        max: 1,
        min: 1,
        idel: 10000
    }
    });

module.exports = sequelize;