import { Op } from 'sequelize';
import { subWeeks } from 'date-fns';

import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.params;

    if (student_id) {
      const student = await Students.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }
    }

    const checkWeek = await Checkins.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subWeeks(new Date(), 1), new Date()],
        },
      },
    });

    if (checkWeek >= 5) {
      return res
        .status(400)
        .json({ error: 'This user already all checkins in this week' });
    }

    await Checkins.create({
      student_id,
    });

    return res.json({ Message: 'Checkin passed' });
  }
}

export default new CheckinController();
