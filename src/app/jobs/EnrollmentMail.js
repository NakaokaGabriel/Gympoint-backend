import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { name, email, plans, start_date, finalDate, totalPrice } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Confirmação de plano',
      template: 'enrollment',
      context: {
        student: name,
        plan: plans.title,
        months: plans.duration,
        start_date: format(parseISO(start_date), "dd'/'LL'/'yyyy", {
          locale: pt,
        }),
        end_date: format(parseISO(finalDate), "dd'/'LL'/'yyyy", { locale: pt }),
        total_price: totalPrice,
      },
    });
  }
}

export default new EnrollmentMail();
