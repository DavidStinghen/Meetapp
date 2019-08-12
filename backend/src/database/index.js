import Sequelize from 'sequelize';

import dbconfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
    this.associate();
  }

  // init Postgres database connections
  init() {
    this.connection = new Sequelize(dbconfig);
    models.map(model => model.init(this.connection));
  }

  // models association
  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
