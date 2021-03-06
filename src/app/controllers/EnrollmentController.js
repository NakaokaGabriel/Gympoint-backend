import { Op } from 'sequelize';
import { parseISO, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';

import Plans from '../models/Plans';
import Students from '../models/Students';
import Enrollments from '../models/Enrollments';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollments.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
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

  async show(req, res) {
    const { id } = req.params;

    const userExist = await Enrollments.findByPk(id);

    if (!userExist) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    const enrollment = await Enrollments.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name'],
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

    if (!plans) {
      return res.status(400).json({ error: 'Plans does not exist' });
    }

    const students = await Students.findByPk(student_id);

    if (!students) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const finalDate = addMonths(parseISO(start_date), plans.duration);
    const totalPrice = plans.price * plans.duration;

    const checkStudent = await Enrollments.findOne({
      where: {
        student_id,
      },
    });

    if (checkStudent) {
      return res.status(400).json({
        error: `This student already has a plan until ${format(
          finalDate,
          "dd'/'MM'/'yyyy",
          {
            locale: pt,
          }
        )}`,
      });
    }

    const enrollment = await Enrollments.create({
      student_id,
      plan_id,
      start_date,
      end_date: finalDate,
      price: totalPrice,
    });

    await Queue.add(EnrollmentMail.key, {
      name: students.name,
      email: students.email,
      plans,
      start_date,
      finalDate,
      totalPrice,
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

    const planExist = await Plans.findByPk(plan_id);

    if (!planExist) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const checkPlan = await Enrollments.findOne({
      where: {
        id: dataEnrollment.id,
        plan_id: {
          [Op.ne]: plan_id,
        },
      },
    });

    if (!checkPlan) {
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

  async delete(req, res) {
    const { id } = req.params;

    await Enrollments.destroy({ where: { id } });

    return res.json({ message: 'this student managment is over' });
  }
}

export default new EnrollmentController();
