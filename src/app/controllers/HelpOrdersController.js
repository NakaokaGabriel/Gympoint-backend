import * as Yup from 'yup';

import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

import HelpOrdersMail from '../jobs/HelpOrdersMail';
import Queue from '../../lib/Queue';

class HelpOrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations failed' });
    }

    const { id } = req.params;

    const ordersExist = await HelpOrders.findByPk(id);

    if (!ordersExist) {
      return res.status(400).json({ error: 'This Questions does not exist' });
    }

    const { answer } = req.body;

    const helpOrders = await ordersExist.update({
      answer,
      answer_at: new Date(),
    });

    const { name, email } = await Students.findByPk(helpOrders.student_id);

    await Queue.add(HelpOrdersMail.key, {
      name,
      email,
      question: helpOrders.question,
      answer,
      answer_at: helpOrders.answer_at,
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
