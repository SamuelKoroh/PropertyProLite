import _ from 'lodash';
import { okResponse, badRequest, setUserImage } from '../utils/refractory';
import db from '../config/db';

/*
@@ Route          /api/v1/users
@@ Method         GET
@@ Description    Get all registered users.
*/
export const getAllUser = async ({ query: { search } }, res) => {
  try {
    let result;
    let strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image, user_type,'
      + ' is_admin,is_active,created_on  FROM users ';

    if (search) {
      strQuery
        += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 '
        + 'OR user_type ILIKE $1 OR phone_number ILIKE $1';
      result = await db.query(strQuery, [`${search}%`]);
    } else result = await db.query(strQuery);

    if (result.rowCount < 1) return badRequest(res, 'There is no matching record');
    okResponse(res, result.rows);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/users/me
@@ Method         GET
@@ Description    Get logged in user profile details.
*/
export const getUserProfile = async ({ user: { id } }, res) => {
  try {
    const strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image, user_type,'
      + ' is_admin,is_active,created_on  FROM users WHERE id=$1';
    const { rows } = await db.query(strQuery, [id]);
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1/users/:userId
@@ Method         GET
@@ Description    Get a single user and the advert he/she uploaded .
*/
export const getUserProperties = async ({ params: { userId } }, res) => {
  try {
    let strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image, user_type,'
      + ' is_admin,is_active,created_on  FROM users WHERE id=$1';
    const { rows } = await db.query(strQuery, [userId]);

    if (!rows[0]) return badRequest(res, 'The user does not exist');

    strQuery = 'SELECT * FROM properties WHERE owner = $1';
    const result = await db.query(strQuery, [userId]);

    okResponse(res, { user: rows[0], userAdverts: result.rows });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/users/:userId
@@ Method         PATCH
@@ Description    Update user profile details.
*/
export const updateUserProfile = async ({ user: { id }, file, body }, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    let { image } = rows[0];

    const keys = Object.keys(body);
    keys.forEach(async (key) => {
      const strQuery = `UPDATE users SET ${key}=$1 WHERE id=$2 `;
      await db.query(strQuery, [body[key], id]);
    });

    if (file) {
      image = await setUserImage(file, image);
      await db.query('UPDATE users SET image=$1 WHERE id=$2', [image, id]);
    }
    const data = {
      ..._.omit(rows[0], ['password', 'reset_password_token', 'reset_password_expires'])
    };
    return okResponse(res, { ...data, ...body, image });
  } catch (error) {
    badRequest(res, 'Image not valid', 500);
  }
};

/*
@@ Route          /api/v1/users/:userId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
export const activateDeactivateUserProfile = async ({ params: { userId } }, res) => {
  try {
    const strQuery = 'UPDATE users SET is_active = NOT is_active WHERE id=$1 RETURNING *';
    const { rows } = await db.query(strQuery, [userId]);
    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(
      res,
      _.omit(rows[0], ['password', 'reset_password_token', 'reset_password_expires'])
    );
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/users/:userId/set-amin
@@ Method         PATCH
@@ Description    Make or remove user as an admin
*/
export const makeRemoveUserAdmin = async ({ params: { userId } }, res) => {};
/*
@@ Route          /api/v1/users/:userId
@@ Method         DELETE
@@ Description    Remove user account permanently from storage
*/
export const deleteUserProfile = async ({ params: { userId } }, res) => {};
