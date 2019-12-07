import Sequelize, { Model } from 'sequelize';

class Enrollments extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Plans, { foreignKey: 'plan_id', as: 'plan' });
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
  }
}

export default Enrollments;
