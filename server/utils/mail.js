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
    await this.transporter.sendMail(this.mailOption);
  }
}

export default Mail;
