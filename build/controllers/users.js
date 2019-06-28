"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUserProfile = exports.activateDeactivateUserProfile = exports.updateUserProfile = exports.getUserProperties = exports.getUserProfile = exports.getAllUser = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var _Users = _interopRequireDefault(require("../models/Users"));

var _refractory = require("../utils/refractory");

var _Properties = _interopRequireDefault(require("../models/Properties"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const filterUsers = (users, query) => {
  let filteredUsers = users;

  if (query) {
    filteredUsers = filteredUsers.filter(u => u.user_type.toLowerCase().startsWith(query.toLowerCase()) || u.first_name.toLowerCase().startsWith(query.toLowerCase()) || u.last_name.toLowerCase().startsWith(query.toLowerCase()) || u.phone_number.toLowerCase().startsWith(query.toLowerCase()) || u.email.toLowerCase().startsWith(query.toLowerCase()) || u.is_active === query);
  }

  return filteredUsers;
};
/*
@@ Route          /api/v1/users
@@ Method         GET
@@ Description    Get all registered users.
*/


const getAllUser = ({
  query
}, res) => {
  let users = filterUsers(_Users.default, query.search);
  if (!users.length) return (0, _refractory.badRequest)(res, 'There is no matching record');
  users = users.map(u => _lodash.default.omit(u, ['password', 'token']));
  (0, _refractory.okResponse)(res, users);
};
/*
@@ Route          /api/v1/users/me
@@ Method         GET
@@ Description    Get logged in user profile details.
*/


exports.getAllUser = getAllUser;

const getUserProfile = ({
  user
}, res) => {
  const userProfile = _Users.default.find(u => parseInt(u.id, 10) === parseInt(user.id, 10));

  (0, _refractory.okResponse)(res, _lodash.default.omit(userProfile, ['password', 'token']));
};
/*
@@ Route          /api/v1/users/:userId
@@ Method         GET
@@ Description    Get a single user and the advert he/she uploaded .
*/


exports.getUserProfile = getUserProfile;

const getUserProperties = ({
  params
}, res) => {
  const user = _Users.default.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));

  if (!user) return (0, _refractory.badRequest)(res, 'The user does not exist');

  const userAdverts = _Properties.default.filter(p => parseInt(p.owner, 10) === parseInt(params.userId, 10));

  (0, _refractory.okResponse)(res, {
    user: _lodash.default.omit(user, ['password', 'token']),
    userAdverts
  });
};
/*
@@ Route          /api/v1/users/:userId
@@ Method         PATCH
@@ Description    Update user profile details.
*/


exports.getUserProperties = getUserProperties;

const updateUserProfile = async ({
  params,
  file,
  body
}, res) => {
  try {
    const user = _Users.default.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));

    if (!user) return (0, _refractory.badRequest)(res, 'The user does not exist');
    const keys = Object.keys(body);
    keys.forEach(key => {
      user[key] = body[key];
    });

    if (file) {
      const result = await _cloudinary.default.v2.uploader.upload(file.path);
      user.image = result.secure_url;
    }

    return (0, _refractory.okResponse)(res, { ..._lodash.default.omit(user, ['password'])
    });
  } catch (error) {
    (0, _refractory.badRequest)(res, 'Image not valid', 400);
  }
};
/*
@@ Route          /api/v1/users/:userId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/


exports.updateUserProfile = updateUserProfile;

const activateDeactivateUserProfile = ({
  params
}, res) => {
  const userProfile = _Users.default.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));

  if (!userProfile) return (0, _refractory.badRequest)(res, 'The user profile does not exist');
  userProfile.is_active = !userProfile.is_active;
  (0, _refractory.okResponse)(res, _lodash.default.omit(userProfile, ['password', 'token']));
};
/*
@@ Route          /api/v1/users/:userId
@@ Method         DELETE
@@ Description    Remove user account permanently from storage
*/


exports.activateDeactivateUserProfile = activateDeactivateUserProfile;

const deleteUserProfile = ({
  params
}, res) => {
  const userProfile = _Users.default.find(u => parseInt(u.id, 10) === parseInt(params.userId, 10));

  if (!userProfile) return (0, _refractory.badRequest)(res, 'The user profile does not exist or has been deleted');

  const index = _Users.default.indexOf(userProfile);

  _Users.default.splice(index, 1);

  (0, _refractory.okResponse)(res, {
    message: 'The user has been removed'
  });
};

exports.deleteUserProfile = deleteUserProfile;
//# sourceMappingURL=users.js.map