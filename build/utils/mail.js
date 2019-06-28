"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Mail {
  constructor(from, to, subject, text) {
    this.mailOptions = {
      from,
      to,
      subject,
      text
    };
    this.transporter = _nodemailer.default.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  async sendMail() {
    try {
      await this.transporter.sendMail(this.mailOptions);
      return 'sent';
    } catch (error) {
      return error;
    }
  }

}

var _default = Mail;
exports.default = _default;
//# sourceMappingURL=mail.js.map