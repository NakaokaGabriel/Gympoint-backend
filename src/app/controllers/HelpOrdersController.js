import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    return res.json({});
  }

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

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
