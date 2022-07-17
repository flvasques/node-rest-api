const sequelize = require('./dbService.js');

const dbsync = async () => {


    await sequelize.sync();
    
} 

module.exports = dbsync;