import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import cloudinary from 'cloudinary';
import Users from '../models/Users';
import { signupSchema, signinSchema } from '../middleware/modelValidation';

const jwtSecret = process.env.JWT_SECRET;

/*
@@ Route          /api/v1/auth/signup
@@ Method         POST
@@ Description    Create user account
*/
export const signUp = async ({ body, file }, res) => {
  const errors = Joi.validate(body, signupSchema);
  if (errors.error)
    return res.status(400).json({ status: 'error', error: errors.error.details[0].message });

  let user = Users.find(u => u.email === body.email);
  if (user) {
    return res.status(400).json({
      status: 'error',
      error: 'This email has been registered already'
    });
  }

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
      expiresIn: 3600
    });
    return res.status(201).json({ status: 'success', data: { ..._.omit(user, ['password']) } });
  } catch (error) {
    res.status(400).json({ status: 'error', error: 'Image not valid' });
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
    if (errors.error)
      return res.status(400).json({ status: 'error', error: errors.error.details[0].message });

    const user = Users.find(u => u.email === body.email);
    if (!user)
      return res.status(400).json({ status: 'error', error: 'Invalid username and password' });

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword)
      return res.status(400).json({ status: 'error', error: 'Invalid username and password' });

    const token = await jwt.sign(_.pick(user, ['id', 'is_admin', 'user_type']), jwtSecret, {
      expiresIn: 3600
    });

    return res.status(200).json({
      status: 'success',
      data: { token, ..._.omit(user, ['password']) }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'An unexpected error has occour' });
  }
};
