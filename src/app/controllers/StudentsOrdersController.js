import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import Enrollment from '../models/Enrollments';

class StudentsOrdersController {
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
