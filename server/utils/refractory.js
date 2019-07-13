import cloudinary from 'cloudinary';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import db from '../config/db';

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

export const filterProperties = (properties, type, deal, price, location) => {
  let result = properties;
  if (type) result = result.filter(p => p.title.toLowerCase().startsWith(type.toLowerCase()));
  if (deal) result = result.filter(p => p.deal_type.toLowerCase() === deal.toLowerCase());
  if (price) result = result.filter(p => parseInt(p.price, 10) <= parseInt(price, 10));
  if (location)
    result = result.filter(
      p =>
        p.state.toLowerCase().startsWith(location.toLowerCase())
        || p.city.toLowerCase().startsWith(location.toLowerCase())
        || p.address.toLowerCase().startsWith(location.toLowerCase())
    );
  return result;
};

export const addDealType = async (req, res, table) => {
  try {
    const { name, description } = req.body;
    const id = name.toLowerCase().replace(' ', '-');
    const strQuery = `INSERT INTO ${table}(id,name,description) VALUES($1,$2,$3) RETURNING *`;
    const { rows } = await db.query(strQuery, [id, name, description]);
    okResponse(res, rows[0], 201);
  } catch (error) {
    badRequest(res, 'It likes this item already exist', 400);
  }
};

export const updateDealType = async (req, res, table) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    const strQuery = `UPDATE ${table} SET name=$1,description=$2 WHERE id=$3 RETURNING *`;
    const { rows } = await db.query(strQuery, [name, description, id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};

export const deleteRow = async (res, table, key) => {
  try {
    const strQuery = `DELETE FROM ${table} WHERE id=$1 RETURNING *`;
    const { rows } = await db.query(strQuery, [key]);
    if (!rows[0]) return badRequest(res, 'The record was not found');
    okResponse(res, { message: 'The item has been deleted' });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

export const getAllRecord = async (res, table) => {
  try {
    const strQuery = `SELECT * FROM ${table}`;
    const { rows } = await db.query(strQuery);
    okResponse(res, rows);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};

export const getRecord = async ({ params: { id } }, res, table) => {
  try {
    const strQuery = `SELECT * FROM ${table} WHERE id=$1`;
    const { rows } = await db.query(strQuery, [id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};

export const toggleboolUserField = async ({ params: { user_id } }, res, field) => {
  try {
    const strQuery = `UPDATE users SET ${field} = NOT ${field} WHERE id=$1 RETURNING *`;
    const { rows } = await db.query(strQuery, [user_id]);
    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    const data = _.omit(rows[0], ['password', 'reset_password_token', 'reset_password_expires']);
    okResponse(res, data);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
