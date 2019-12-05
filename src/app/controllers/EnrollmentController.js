import { Op } from 'sequelize';
import { parseISO, addMonths } from 'date-fns';

import Plans from '../models/Plans';
import Students from '../models/Students';
import Enrollments from '../models/Enrollments';

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollments.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['id', 'title', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const plans = await Plans.findByPk(plan_id);

    const checkStudent = await Enrollments.findOne({
      where: {
        student_id,
      },
    });

    if (checkStudent) {
      return res.status(400).json({ error: 'This student already has a plan' });
    }

    const finalDate = addMonths(parseISO(start_date), plans.duration);
    const totalPrice = plans.price * plans.duration;

    const enrollment = await Enrollments.create({
      student_id,
      plan_id,
      start_date,
      end_date: finalDate,
      price: totalPrice,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
