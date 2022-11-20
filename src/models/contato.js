const { DataTypes } = require('sequelize');
const sequelize = require('../dbService');
const User = require('./user');

const Contato = sequelize.define('Contato', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references : {
            model: User,
            key: 'id'
        }
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'contatos'
});

module.exports = Contato;