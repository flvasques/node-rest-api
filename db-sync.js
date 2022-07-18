const sequelize = require('./dbService.js');
const User = require('./models/user');
const Contato = require('./models/contato');

const dbsync = async () => {
    User.hasMany(Contato, {
        foreignKey: 'userId',
        as: 'constatos'
    });

    Contato.belongsTo(User, {
        ContatoforeignKey: 'userId',
        as: 'usuario'
    });

    await sequelize.sync();
    
} 

module.exports = dbsync;