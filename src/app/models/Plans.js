import Sequelize, { Model } from 'sequelize';

class Plans extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );
  }
}

export default Plans;
