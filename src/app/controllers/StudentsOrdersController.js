import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import Enrollment from '../models/Enrollments';

class StudentsOrdersController {
  async index(req, res) {
    const { id } = req.params;

    if (id) {
      const student = await Students.findByPk(id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }
    }

    const helpOrders = await HelpOrders.findAll({
      where: {
        student_id: id,
      },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { student_id } = req.params;

    if (student_id) {
      const student = await Students.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }
    }

    const checkEnrollment = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    if (!checkEnrollment) {
      return res
        .status(400)
        .json({ error: 'This students does not have registration' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrders.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new StudentsOrdersController();
