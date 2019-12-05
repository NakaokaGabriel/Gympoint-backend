import { parseISO, addMonths } from 'date-fns';

import Plans from '../models/Plans';
import Enrollments from '../models/Enrollments';

class EnrollmentController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const plans = await Plans.findByPk(plan_id);

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
