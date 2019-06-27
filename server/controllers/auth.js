import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import crypto from 'crypto';
import cloudinary from 'cloudinary';
import Mail from '../utils/mail';
import Users from '../models/Users';
import { okResponse, badRequest } from '../utils/refractory';
import { signupSchema, signinSchema, emailSchema } from '../middleware/modelValidation';
import curDate from '../utils/date';

const jwtSecret = process.env.JWT_SECRET;

/*
@@ Route          /api/v1/auth/signup
@@ Method         POST
@@ Description    Create user account
*/
export const signUp = async ({ body, file }, res) => {
  const errors = Joi.validate(body, signupSchema);
  if (errors.error) return badRequest(res, errors.error.details[0].message, 400);

  let user = Users.find(u => u.email === body.email);
  if (user) return badRequest(res, 'This email has been registered already', 400);

  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);

    user = {
      id: Users.length + 1,
      ...body,
      is_admin: false,
      password,
      is_active: true,
      created_on: curDate()
    };

    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      user.image = result.secure_url;
    }

    Users.push(user);
    user.token = await jwt.sign(_.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
      expiresIn: 36000
    });
    return okResponse(res, { ..._.omit(user, ['password']) }, 201);
  } catch (error) {
    badRequest(res, 'Image not valid', 400);
  }
};

/*
@@ Route          /api/v1/auth/signIn
@@ Method         POST
@@ Description    Login a user
*/
export const signIn = async ({ body }, res) => {
  try {
    const errors = Joi.validate(body, signinSchema);
    if (errors.error) return badRequest(res, errors.error.details[0].message, 400);

    const user = Users.find(u => u.email === body.email);
    if (!user) return badRequest(res, 'Invalid username and password', 400);

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) return badRequest(res, 'Invalid username and password', 400);

    const token = await jwt.sign(_.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
      expiresIn: 36000
    });

    return okResponse(res, { token, ..._.omit(user, ['password']) });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

export const sendResetLink = async ({ body }, res) => {
  const errors = Joi.validate(body, emailSchema);
  if (errors.error) return badRequest(res, errors.error, 400);

  const user = Users.find(u => u.email === body.email);
  if (!user) return badRequest(res, 'The account does not exist');

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 360000;

  const text = 'You are receiving this because you (or some else) have requested the reset of the password for your account.\n\n'
    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n'
    + `http://localhost:3500/api/v1/auth/reset-password/${token}\n\n`
    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';

  const mail = new Mail('Property Pro', user.email, 'Reset Password', text);
  const result = await mail.sendMail();
  res.send(result);
};

export const validateUrlToken = ({ params }, res) => {
  const user = Users.find(u => u.resetPasswordToken === params.token);
  if (!user) return badRequest(res, 'The reset link is invalid or has expired');
  okResponse(res, { email: user.email, user_id: user.id });
};

export const updateUserPassword = async ({ body }, res) => {
  const errors = Joi.validate(body, signinSchema);
  if (errors.error) return badRequest(res, errors.error, 400);

  const user = Users.find(u => u.email === body.email);
  if (!user) return badRequest(res, 'The profile account does not exists');

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(body.password, salt);
  user.resetPasswordExpires = null;
  user.resetPasswordToken = null;
  user.token = await jwt.sign(_.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
    expiresIn: 360000
  });

  return okResponse(res, _.omit(user, ['password']));
};
