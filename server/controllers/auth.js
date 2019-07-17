import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../config/db';
import mail from '../utils/mail';
import { okResponse, badRequest, setUserImage, generateUserToken } from '../utils/refractory';

/*
@@ Route          /api/v1/auth/signup
@@ Method         POST
@@ Description    Create user account
*/
export const signUp = async ({ body, file }, res) => {
  const user = await db.query('SELECT * FROM users WHERE email = $1', [body.email]);
  if (user.rowCount > 0) return badRequest(res, 'This email has been registered already', 400);

  try {
    const { first_name, last_name, email, phone_number, address } = body;

    const image = await setUserImage(file, '');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);

    const text = 'INSERT INTO users(first_name,last_name,email,password,phone_number,address,image_url)'
      + ' VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *';

    const { rows } = await db.query(text, [
      first_name,
      last_name,
      email,
      password,
      phone_number,
      address,
      image
    ]);

    const data = await generateUserToken(rows[0]);
    return okResponse(res, data, 201);
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
export const signIn = async ({ body }, res) => {
  try {
    const { rows: user } = await db.query(
      'SELECT * FROM users WHERE email = $1 AND is_active=true',
      [body.email]
    );
    if (!user[0]) return badRequest(res, 'Invalid username and password', 400);

    const validPassword = await bcrypt.compare(body.password, user[0].password);
    if (!validPassword) return badRequest(res, 'Invalid username and password', 400);

    const data = await generateUserToken(user[0]);
    return okResponse(res, data);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  } finally {
    // db.release();
  }
};

export const sendResetLink = async ({ params: { email } }, res) => {
  try {
    const { rows: user } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user[0]) return badRequest(res, 'The account does not exist');

    const token = crypto.randomBytes(20).toString('hex');

    const strQuery = 'UPDATE users SET  reset_password_token=$1, reset_password_expires=$2 WHERE email=$3';
    await db.query(strQuery, [token, Date.now() + 360000, email]);

    const text = 'You are receiving this because you (or some else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n'
      + `http://localhost:3500/api/v1/auth/${token}/reset-password\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';

    const result = await mail.sendMail(
      process.env.MAIL_USER,
      user[0].email,
      'Reset Password',
      text
    );
    if (result !== 'sent') return badRequest(res, result, 400);
    okResponse(res, {
      message: 'The link to rest your profile has been sent to this email address'
    });
  } catch (error) {
    badRequest(res, error, 500);
  } finally {
    // db.release();
  }
};
export const validateUrlToken = async ({ params: { token } }, res) => {
  try {
    const { rows: user } = await db.query('SELECT * FROM users WHERE reset_password_token=$1', [
      token.trim()
    ]);

    if (!user[0] || parseInt(Date.now(), 10) > parseInt(user[0].reset_password_expires, 10))
      return badRequest(res, 'The reset link is invalid or has expired');

    okResponse(res, { email: user[0].email });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  } finally {
    // db.release();
  }
};
export const updateUserPassword = async ({ body, params }, res) => {
  try {
    let user = await db.query('SELECT * FROM users WHERE reset_password_token=$1 AND email=$2', [
      params.token,
      body.email
    ]);

    if (!user.rows[0]) return badRequest(res, 'The profile account does not exists');

    const validOldPass = await bcrypt.compare(body.old_password, user.rows[0].password);

    if (!validOldPass) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);
      const strQuery = 'UPDATE users SET password=$1, reset_password_token=null, '
        + ' reset_password_expires=null WHERE id=$2 RETURNING *';
      user = await db.query(strQuery, [password, user.rows[0].id]);
    }

    const data = await generateUserToken(user.rows[0]);
    return okResponse(res, data);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  } finally {
    // db.release();
  }
};
