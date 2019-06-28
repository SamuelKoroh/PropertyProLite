"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserPassword = exports.validateUrlToken = exports.sendResetLink = exports.signIn = exports.signUp = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _lodash = _interopRequireDefault(require("lodash"));

var _crypto = _interopRequireDefault(require("crypto"));

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var _mail = _interopRequireDefault(require("../utils/mail"));

var _Users = _interopRequireDefault(require("../models/Users"));

var _refractory = require("../utils/refractory");

var _modelValidation = require("../middleware/modelValidation");

var _date = _interopRequireDefault(require("../utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtSecret = process.env.JWT_SECRET;
/*
@@ Route          /api/v1/auth/signup
@@ Method         POST
@@ Description    Create user account
*/

const signUp = async ({
  body,
  file
}, res) => {
  const errors = _joi.default.validate(body, _modelValidation.signupSchema);

  if (errors.error) return (0, _refractory.badRequest)(res, errors.error.details[0].message, 400);

  let user = _Users.default.find(u => u.email === body.email);

  if (user) return (0, _refractory.badRequest)(res, 'This email has been registered already', 400);

  try {
    const salt = await _bcrypt.default.genSalt(10);
    const password = await _bcrypt.default.hash(body.password, salt);
    user = {
      id: _Users.default.length + 1,
      ...body,
      is_admin: false,
      password,
      is_active: true,
      created_on: (0, _date.default)()
    };

    if (file) {
      const result = await _cloudinary.default.v2.uploader.upload(file.path);
      user.image = result.secure_url;
    }

    _Users.default.push(user);

    user.token = await _jsonwebtoken.default.sign(_lodash.default.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
      expiresIn: 36000
    });
    return (0, _refractory.okResponse)(res, { ..._lodash.default.omit(user, ['password'])
    }, 201);
  } catch (error) {
    (0, _refractory.badRequest)(res, 'Image not valid', 400);
  }
};
/*
@@ Route          /api/v1/auth/signIn
@@ Method         POST
@@ Description    Login a user
*/


exports.signUp = signUp;

const signIn = async ({
  body
}, res) => {
  try {
    const errors = _joi.default.validate(body, _modelValidation.signinSchema);

    if (errors.error) return (0, _refractory.badRequest)(res, errors.error.details[0].message, 400);

    const user = _Users.default.find(u => u.email === body.email);

    if (!user) return (0, _refractory.badRequest)(res, 'Invalid username and password', 400);
    const validPassword = await _bcrypt.default.compare(body.password, user.password);
    if (!validPassword) return (0, _refractory.badRequest)(res, 'Invalid username and password', 400);
    const token = await _jsonwebtoken.default.sign(_lodash.default.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
      expiresIn: 36000
    });
    return (0, _refractory.okResponse)(res, {
      token,
      ..._lodash.default.omit(user, ['password'])
    });
  } catch (error) {
    (0, _refractory.badRequest)(res, 'An unexpected error has occour', 500);
  }
};

exports.signIn = signIn;

const sendResetLink = async ({
  body
}, res) => {
  const errors = _joi.default.validate(body, _modelValidation.emailSchema);

  if (errors.error) return (0, _refractory.badRequest)(res, errors.error, 400);

  const user = _Users.default.find(u => u.email === body.email);

  if (!user) return (0, _refractory.badRequest)(res, 'The account does not exist');

  const token = _crypto.default.randomBytes(20).toString('hex');

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 360000;
  const text = 'You are receiving this because you (or some else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n' + `http://localhost:3500/api/v1/auth/reset-password/${token}\n\n` + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';
  const mail = new _mail.default('Property Pro', user.email, 'Reset Password', text);
  const result = await mail.sendMail();
  if (result !== 'sent') return (0, _refractory.badRequest)(res, result, 400);
  (0, _refractory.okResponse)(res, {
    message: 'The link to rest your profile has been sent to this email address'
  });
};

exports.sendResetLink = sendResetLink;

const validateUrlToken = ({
  params
}, res) => {
  const user = _Users.default.find(u => u.resetPasswordToken === params.token && parseInt(u.resetPasswordExpires, 10) > parseInt(Date.now(), 10));

  if (!user) return (0, _refractory.badRequest)(res, 'The reset link is invalid or has expired');
  (0, _refractory.okResponse)(res, {
    email: user.email
  });
};

exports.validateUrlToken = validateUrlToken;

const updateUserPassword = async ({
  body,
  params
}, res) => {
  const errors = _joi.default.validate(body, _modelValidation.signinSchema);

  if (errors.error) return (0, _refractory.badRequest)(res, errors.error, 400);

  const user = _Users.default.find(u => u.email === body.email && u.resetPasswordToken === params.token);

  if (!user) return (0, _refractory.badRequest)(res, 'The profile account does not exists');
  const salt = await _bcrypt.default.genSalt(10);
  user.password = await _bcrypt.default.hash(body.password, salt);
  user.resetPasswordExpires = null;
  user.resetPasswordToken = null;
  user.token = await _jsonwebtoken.default.sign(_lodash.default.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
    expiresIn: 360000
  });
  return (0, _refractory.okResponse)(res, _lodash.default.omit(user, ['password']));
};

exports.updateUserPassword = updateUserPassword;