import _ from 'lodash';
import cloudinary from 'cloudinary';
import Users from '../models/Users';
import { okResponse, badRequest } from '../utils/refractory';
import Properties from '../models/Properties';

const filterUsers = (users, query) => {
  let filteredUsers = users;
  if (query) {
    filteredUsers = filteredUsers.filter(
      u =>
        u.user_type.toLowerCase().startsWith(query.toLowerCase())
        || u.first_name.toLowerCase().startsWith(query.toLowerCase())
        || u.last_name.toLowerCase().startsWith(query.toLowerCase())
        || u.phone_number.toLowerCase().startsWith(query.toLowerCase())
        || u.email.toLowerCase().startsWith(query.toLowerCase())
        || u.is_active === query
    );
  }
  return filteredUsers;
};

/*
@@ Route          /api/v1/users
@@ Method         GET
@@ Description    Get all registered users.
*/
export const getAllUser = ({ query }, res) => {
  let users = filterUsers(Users, query.search);
  if (!users.length) return badRequest(res, 'There is no matching record');
  users = users.map(u => _.omit(u, ['password', 'token']));
  okResponse(res, users);
};

/*
@@ Route          /api/v1/users/me
@@ Method         GET
@@ Description    Get logged in user profile details.
*/
export const getUserProfile = ({ user }, res) => {
  const userProfile = Users.find(u => parseInt(u.id, 10) === parseInt(user.id, 10));
  okResponse(res, _.omit(userProfile, ['password', 'token']));
};

/*
@@ Route          /api/v1/users/:userId
@@ Method         GET
@@ Description    Get a single user and the advert he/she uploaded .
*/
export const getUserProperties = ({ params }, res) => {
  const user = Users.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));
  if (!user) return badRequest(res, 'The user does not exist');
  const userAdverts = Properties.filter(p => parseInt(p.owner, 10) === parseInt(params.userId, 10));
  okResponse(res, { user: _.omit(user, ['password', 'token']), userAdverts });
};

/*
@@ Route          /api/v1/users/:userId
@@ Method         PATCH
@@ Description    Update user profile details.
*/
export const updateUserProfile = async ({ params, file, body }, res) => {
  try {
    const user = Users.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));
    if (!user) return badRequest(res, 'The user does not exist');

    const keys = Object.keys(body);
    keys.forEach((key) => {
      user[key] = body[key];
    });

    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      user.image = result.secure_url;
    }
    return okResponse(res, { ..._.omit(user, ['password']) });
  } catch (error) {
    badRequest(res, 'Image not valid', 400);
  }
};

/*
@@ Route          /api/v1/users/:userId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
export const activateUserProfile = ({ params }, res) => {
  const userProfile = Users.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));
  if (!userProfile) return badRequest(res, 'The user profile does not exist');
  userProfile.is_active = true;
  okResponse(res, _.omit(userProfile, ['password', 'token']));
};

/*
@@ Route          /api/v1/users/:userId/deactivate
@@ Method         PATCH
@@ Description    Deactivate user account
*/
export const deactivateUserProfile = ({ params }, res) => {
  const userProfile = Users.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));
  if (!userProfile) return badRequest(res, 'The user profile does not exist');
  userProfile.is_active = false;
  okResponse(res, _.omit(userProfile, ['password', 'token']));
};

/*
@@ Route          /api/v1/users/:userId
@@ Method         DELETE
@@ Description    Remove user account permanently from storage
*/
export const deleteUserProfile = ({ params }, res) => {
  const userProfile = Users.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));
  if (!userProfile) return badRequest(res, 'The user profile does not exist or has been deleted');
  const index = Users.indexOf(userProfile);
  Users.splice(index, 1);
  okResponse(res, { message: 'The user has been removed' });
};
