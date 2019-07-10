import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import db from '../config/db';
import { okResponse, badRequest, setUserImage } from '../utils/refractory';
import { signupSchema } from '../middlewares/validators';

// const db = new Database();
const jwtSecret = process.env.JWT_SECRET;

/*
@@ Route          /api/v1/auth/signup
@@ Method         POST
@@ Description    Create user account
*/
export const signUp = async ({ body, file }, res) => {
  const errors = Joi.validate(body, signupSchema);
  if (errors.error) return badRequest(res, errors.error.details[0].message, 400);

  const user = await db.query('SELECT * FROM users WHERE email = $1', [body.email]);
  if (user.rowCount > 0) return badRequest(res, 'This email has been registered already', 400);

  try {
    const { first_name, last_name, email, phone_number, address, user_type } = body;

    const image = await setUserImage(file, '');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);

    const text = 'INSERT INTO users(first_name,last_name,email,password,phone_number,address,image,user_type)'
      + ' VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';

    const { rows } = await db.query(text, [
      first_name,
      last_name,
      email,
      password,
      phone_number,
      address,
      image,
      user_type
    ]);

    const payload = _.pick(rows[0], ['id', 'is_admin', 'user_type']);
    const token = await jwt.sign(payload, jwtSecret, { expiresIn: 36000 });
    const data = {
      ..._.omit(rows[0], ['password', 'reset_password_token', 'reset_password_expires'])
    };
    return okResponse(res, { token, ...data }, 201);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  } finally {
    // db.release();
  }
};

/*
@@ Route          /api/v1/auth/signIn
@@ Method         POST
@@ Description    Login a user
*/
export const signIn = async ({ body }, res) => {};
