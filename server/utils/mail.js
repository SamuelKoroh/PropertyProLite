import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export default {
  sendMail: async (from, to, subject, text = null, html = null) => {
    await transporter.sendMail({
      from: `Property Pro Lite 👻 ${from}`,
      to,
      subject,
      text,
      html
    });
    return 'sent';
  }
};
