import Joi from 'joi';
import uploadImages from '../utils/uploadFiles';
import { propertySchema } from '../middlewares/validators';
import { okResponse, badRequest } from '../utils/refractory';
import db from '../config/db';

export const createAdvert = async ({ user: { id }, files, body }, res) => {
  try {
    const errors = Joi.validate(body, propertySchema);
    if (errors.error) return badRequest(res, errors, 400);

    const { title, price, state, city, address, type, deal_type, billing_type, description } = body;

    let result = await db.query('SELECT * FROM properties WHERE lower(title)=$1 AND owner=$2', [
      title.toLowerCase(),
      id
    ]);

    if (result.rowCount > 0) return badRequest(res, 'This property already exists', 400);

    const strQuery = 'INSERT INTO properties (title,owner,price,state,city,address,type,deal_type, '
      + 'billing_type,image_url,description) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';

    let imageUrl;
    if (files) {
      const response = await uploadImages(files);
      imageUrl = response.images;
    }

    result = await db.query(strQuery, [
      title,
      id,
      price,
      state,
      city,
      address,
      type,
      deal_type,
      billing_type,
      imageUrl,
      description
    ]);

    return okResponse(res, result.rows[0], 201);
  } catch (error) {
    badRequest(res, error, 500);
  }
};

export const getProperties = async (req, res) => {};
