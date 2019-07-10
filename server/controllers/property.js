import Joi from 'joi';
import uploadImages from '../utils/uploadFiles';
import { propertySchema } from '../middlewares/validators';
import { okResponse, badRequest, filterProperties } from '../utils/refractory';
import db from '../config/db';

/*
@@ Route          /api/v1/property
@@ Method         POST
@@ Description    Create a property advert.
*/
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

/*
@@ Route          /api/v1//property/
@@ Route          /api/v1//property/?type=val&price=val&location=val&deal=val
@@ Method         GET
@@ Description    Get all property adverts.
*/
export const getProperties = async ({ query }, res) => {
  try {
    const { location, type, deal, price } = query;

    const strQuery = 'SELECT A.*,B.id AS owner,B.email AS owner_Email,B.phone_number AS owner_Phone'
      + ' FROM properties A INNER JOIN users B on A.owner=B.id WHERE A.status=$1 AND A.is_active=$2';
    const { rows } = await db.query(strQuery, ['available', true]);

    const properties = filterProperties(rows, type, deal, price, location);
    if (!properties.length) return badRequest(res, 'No property was found');

    okResponse(res, properties);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1//property/:propertyId
@@ Method         GET
@@ Description    Get all property adverts.
*/
export const getProperty = async ({ params: { propertyId } }, res) => {
  try {
    const strQuery = 'SELECT A.*,B.id AS owner,B.email AS owner_Email,B.phone_number AS owner_Phone'
      + ' FROM properties A INNER JOIN users B on A.owner=B.id WHERE A.id=$1 AND A.status=$2 AND A.is_active=$3';
    const { rows } = await db.query(strQuery, [propertyId, 'available', true]);

    if (!rows[0]) return badRequest(res, 'The property does not exist');

    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:propertyId
@@ Method         PATCH
@@ Description    Update a property advert.
*/
export const updateProperty = async ({ params: { propertyId }, body, files, user }, res) => {
  try {
    let strQuery = 'SELECT * FROM properties WHERE id=$1';
    const { rows } = await db.query(strQuery, [propertyId]);

    if (!rows[0]) return badRequest(res, 'The advert does not exist', 404);

    if (parseInt(rows[0].owner, 10) !== parseInt(user.id, 10))
      return badRequest(res, 'Access Denied - Authorize access', 403);

    const keys = Object.keys(body);
    keys.forEach(async (key) => {
      strQuery = `UPDATE properties SET ${key}=$1 WHERE id=$2 AND owner=$3 RETURNING *`;
      await db.query(strQuery, [body[key], propertyId, user.id]);
    });

    if (files.length) {
      const response = await uploadImages(files);
      strQuery = 'UPDATE properties SET image_url = $1 WHERE id=$2 AND owner=$3 RETURNING *';
      await db.query(strQuery, [response.images, propertyId, user.id]);
    }
    okResponse(res, { ...rows[0], ...body });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:propertyId/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/
export const markPropertySold = async ({ params: { propertyId }, user: { id } }, res) => {
  try {
    const strQuery = 'UPDATE properties SET status=$1 WHERE id=$2 AND owner=$3 RETURNING *';
    const { rows } = await db.query(strQuery, ['sold', propertyId, id]);

    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
