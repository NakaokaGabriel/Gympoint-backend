import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

class UnansweredController {
  async index(req, res) {
    const unanswered = await HelpOrders.findAll({
      where: {
        answer: null,
      },
      attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(unanswered);
  }
}

export default new UnansweredController();
