import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import cloudinary from 'cloudinary';
import Users from '../models/Users';
import { okResponse, badRequest } from '../utils/refractory';
import { signupSchema, signinSchema } from '../middleware/modelValidation';

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
      password
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
