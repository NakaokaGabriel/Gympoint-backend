import { Op } from 'sequelize';
import * as Yup from 'yup';
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
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

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

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;

    const dataEnrollment = await Enrollments.findByPk(id);

    const { plan_id, start_date } = req.body;

    const checkPlan = await Enrollments.findOne({
      where: {
        id: dataEnrollment.id,
        plan_id: {
          [Op.gt]: plan_id,
        },
      },
    });

    if (checkPlan) {
      return res.status(401).json({
        error: 'Plan cannot be upgraded',
      });
    }

    const { duration, price } = await Plans.findByPk(plan_id);

    const finalDate = addMonths(parseISO(start_date), duration);
    const finalPrice = price * duration;

    const enrollment = await dataEnrollment.update({
      plan_id,
      student_id: dataEnrollment.student_id,
      start_date,
      end_date: finalDate,
      price: finalPrice,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
