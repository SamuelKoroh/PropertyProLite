import nodemailer from 'nodemailer';

class Mail {
  constructor(from, to, subject, text) {
    this.mailOption = {
      from,
      to,
      subject,
      text
    };

    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  async sendMail() {
    try {
      await this.transporter.sendMail(this.mailOption);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Mail;
