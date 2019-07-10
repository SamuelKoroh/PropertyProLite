import cloudinary from 'cloudinary';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export const okResponse = (res, data, code = 200) => {
  return res.status(code).json({ status: 'success', data });
};

export const badRequest = (res, msg, code = 404) => {
  return res.status(code).json({ status: 'error', error: msg });
};

export const setUserImage = async (file, curVal) => {
  let imageURL = curVal;
  if (file) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    imageURL = result.secure_url;
  }
  return imageURL;
};

export const generateUserToken = async (user) => {
  const payload = _.pick(user, ['id', 'is_admin', 'user_type']);
  const token = await jwt.sign(payload, jwtSecret, { expiresIn: 360000 });
  const data = _.omit(user, ['password', 'reset_password_token', 'reset_password_expires']);
  return { token, ...data };
};
