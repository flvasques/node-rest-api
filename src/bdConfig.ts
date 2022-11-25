import { Sequelize } from 'sequelize-typescript';
require('dotenv').config();

class Database {
  public connect: Sequelize;

  constructor() {
    if(process.env.DB_TYPE == 'SQL') {
        this.connect = new Sequelize((process.env.DATA_BASE || ''), (process.env.DB_USER || ''), process.env.PASSWORD, {
          dialect: 'mysql',
          port: parseInt(process.env.DATA_BASE_PORT || '3306'),
          pool: {
            max: 1,
            min: 1,
        }
       });
    } else {
        this.connect = new Sequelize('sqlite::memory:');
    }
  }
}

const connection: Database = new Database();

export default connection;