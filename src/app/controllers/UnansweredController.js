import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';

class UnansweredController {
  async index(req, res) {
    const unanswered = await HelpOrders.findAll();

    return res.json(unanswered);
  }
}

export default new UnansweredController();
