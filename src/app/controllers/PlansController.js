import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const plan = await Plans.findAll();

    return res.json(plan);
  }

  async show(req, res) {
    const { id } = req.params;

    const planExist = await Plans.findByPk(id);

    if (!planExist) {
      return res.status(400).json({ error: 'This does not exists' });
    }

    const plan = await Plans.findOne({
      where: {
        id,
      },
    });

    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations failed' });
    }

    const { title, duration, price } = req.body;

    const titleCheck = await Plans.findOne({
      where: {
        title,
      },
    });

    if (titleCheck) {
      return res.status(400).json({ error: 'Title already exist' });
    }

    const plans = await Plans.create({
      title,
      duration,
      price,
    });

    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations failed' });
    }

    const plan = await Plans.findByPk(req.params.id);

    const { title, duration, price } = req.body;

    const data = await plan.update({ title, duration, price });

    return res.json(data);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Plans.destroy({ where: { id } });

    return res.json({ Message: 'Plan delete with success' });
  }
}

export default new PlansController();
