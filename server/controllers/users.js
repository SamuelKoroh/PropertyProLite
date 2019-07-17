import _ from 'lodash';
import {
  okResponse,
  badRequest,
  setUserImage,
  toggleboolUserField,
  deleteRow
} from '../utils/refractory';
import db from '../config/db';

/*
@@ Route          /api/v1/users
@@ Method         GET
@@ Description    Get all registered users.
*/
export const getAllUser = async ({ query: { search } }, res) => {
  try {
    let result;
    let strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image_url,'
      + ' is_admin,is_active,created_on  FROM users ';

    if (search) {
      strQuery
        += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 '
        + 'OR phone_number ILIKE $1';
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
    const strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image_url,'
      + ' is_admin,is_active,created_on  FROM users WHERE id=$1';
    const { rows } = await db.query(strQuery, [id]);
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1/users/:user_id
@@ Method         GET
@@ Description    Get a single user and the advert he/she uploaded .
*/
export const getUserProperties = async ({ params: { user_id } }, res) => {
  try {
    let strQuery = 'SELECT id, first_name, last_name, email, phone_number, address, image_url,'
      + ' is_admin,is_active,created_on  FROM users WHERE id=$1';
    const { rows } = await db.query(strQuery, [user_id]);

    if (!rows[0]) return badRequest(res, 'The user does not exist');

    strQuery = 'SELECT * FROM properties WHERE owner = $1';
    const result = await db.query(strQuery, [user_id]);

    okResponse(res, { user: rows[0], userAdverts: result.rows });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/users/:user_id
@@ Method         PATCH
@@ Description    Update user profile details.
*/
export const updateUserProfile = async ({ user: { id }, file, body }, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    let { image_url } = rows[0];

    const { first_name, last_name, phone_number, address } = body;

    let strQuery = 'UPDATE users SET first_name=$1, last_name=$2, '
      + ' phone_number=$3, address=$4 WHERE id=$5 RETURNING * ';
    let result = await db.query(strQuery, [first_name, last_name, phone_number, address, id]);

    if (file) {
      image_url = await setUserImage(file, image_url);
      strQuery = 'UPDATE users SET image_url=$1 WHERE id=$2 RETURNING *';
      result = await db.query(strQuery, [image_url, id]);
    }
    const data = {
      ..._.omit(result.rows[0], ['password', 'reset_password_token', 'reset_password_expires'])
    };
    return okResponse(res, data);
  } catch (error) {
    badRequest(res, 'Image not valid', 500);
  }
};

/*
@@ Route          /api/v1/users/:user_id/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
export const activateDeactivateUserProfile = (req, res) => {
  toggleboolUserField(req, res, 'is_active');
};

/*
@@ Route          /api/v1/users/:user_id/set-amin
@@ Method         PATCH
@@ Description    Make or remove user as an admin
*/
export const makeRemoveUserAdmin = async (req, res) => {
  toggleboolUserField(req, res, 'is_admin');
};
/*
@@ Route          /api/v1/users/:user_id
@@ Method         DELETE
@@ Description    Remove user account permanently from storage
*/
export const deleteUserProfile = async ({ params: { user_id } }, res) => {
  deleteRow(res, 'users', user_id);
};
