import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrdersMail {
  get key() {
    return 'HelpOrdersMail';
  }

  async handle({ data }) {
    const { name, email, question, answer, answer_at } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Pedidos de auxílio',
      template: 'helpOrders',
      context: {
        question,
        answer,
        answer_at: format(parseISO(answer_at), "EEEE 'de' LLLL 'às' hh:mm:ss", {
          locale: pt,
        }),
      },
    });
  }
}

export default new HelpOrdersMail();
