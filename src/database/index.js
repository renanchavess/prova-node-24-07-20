
const Sequelize = require('sequelize');

const user = require('../app/models/User');

const databaseConfig = require('../config/database');

const models = [user];

class Database {
  constructor() {
    this.init();
  } 

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
  }
}

module.exports = new Database();