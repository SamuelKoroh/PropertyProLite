import _ from 'lodash';
import { okResponse, badRequest } from '../utils/refractory';
import db from '../config/db';

/*
@@ Route          /api/v1/users
@@ Method         GET
@@ Description    Get all registered users.
*/
export const getAllUser = async ({ query: { search } }, res) => {
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
};

/*
@@ Route          /api/v1/users/me
@@ Method         GET
@@ Description    Get logged in user profile details.
*/
export const getUserProfile = async ({ user: { id } }, res) => {};

/*
@@ Route          /api/v1/users/:userId
@@ Method         GET
@@ Description    Get a single user and the advert he/she uploaded .
*/
export const getUserProperties = async ({ params: { userId } }, res) => {};

/*
@@ Route          /api/v1/users/:userId
@@ Method         PATCH
@@ Description    Update user profile details.
*/
export const updateUserProfile = async ({ user: { id }, file, body }, res) => {};

/*
@@ Route          /api/v1/users/:userId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
export const activateDeactivateUserProfile = async ({ params: { userId } }, res) => {};

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
