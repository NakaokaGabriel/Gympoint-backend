import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Enrollments from '../app/models/Enrollments';
import Checkins from '../app/models/Checkins';
import HelpOrders from '../app/models/HelpOrders';

const models = [User, Students, Plans, Enrollments, Checkins, HelpOrders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
