import { Op } from 'sequelize';
import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async index(req, res) {
    const { name } = req.query;

    const student = await Students.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    if (student <= 0) {
      return res.status(400).json({ error: 'Student not found' });
    }

    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .integer(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { email } = req.body;

    const studentExist = await Students.findOne({ where: { email } });

    if (studentExist) {
      return res.status(400).json({ error: 'Email already exist' });
    }

    const { name, age, weight, height } = req.body;

    const students = await Students.create({
      name,
      email,
      age,
      weight,
      height,
    });

    return res.json(students);
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Students.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations failed' });
    }

    const { id } = req.query;

    const students = await Students.findByPk(id);

    const { email } = req.body;

    if (email === students.email) {
      const emailExist = await Students.findOne({ where: { email } });

      if (emailExist) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }

    const { name, age, weight, height } = await students.update(req.body);

    return res.json({ name, email, age, weight, height });
  }

  async delete(req, res) {
    const { id } = req.params;

    const checkId = await Students.findByPk(id);

    if (!checkId) {
      return res.status(400).json({ error: 'This id does not exist' });
    }

    await Students.destroy({ where: { id } });

    return res.json({ message: 'Id was deleted' });
  }
}

export default new StudentsController();
