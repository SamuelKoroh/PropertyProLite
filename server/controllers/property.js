import Joi from 'joi';
import uploadImages from '../utils/upload-files';
import { createPropertySchema } from '../middleware/modelValidation';
import { okResponse, badRequest } from '../utils/refractory';
import db from '../db/db';

// ///////////////////////////////////////////////////////////////////
/* This region is for code refractory

*/

const filterProperties = (properties, type, deal, price, location) => {
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
/*
@@ end of refractory
*/
// ///////////////////////////////////////////////////////////////////////////

/*
@@ Route          /api/v1/property
@@ Method         POST
@@ Description    Create a property ad.
*/
export const createProperty = async ({ user: { id }, files, body }, res) => {
  try {
    const errors = Joi.validate(body, createPropertySchema);
    if (errors.error) return badRequest(res, errors, 400);

    let result = await db.query('SELECT * FROM properties WHERE lower(title)=$1 AND owner=$2', [
      body.title.toLowerCase(),
      id
    ]);

    if (result.rowCount > 0) return badRequest(res, 'This property already exists', 400);

    const strQuery = 'INSERT INTO properties (title,owner,price,state,city,address,type,deal_type, '
      + 'billing_type,image_url,description) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';

    let image_url;
    if (files) {
      const response = await uploadImages(files);
      image_url = response.images;
    }

    result = await db.query(strQuery, [
      body.title,
      id,
      body.price,
      body.state,
      body.city,
      body.address,
      body.type,
      body.deal_type,
      body.billing_type,
      image_url,
      body.description
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
export const getProperties = async (req, res) => {
  try {
    const { location, type, deal, price } = req.query;

    const strQuery = 'SELECT A.*,B.id AS owner,B.email AS owner_Email,B.phone_number AS owner_Phone'
      + ' FROM properties A INNER JOIN users B on A.owner=B.id WHERE A.status=$1 AND A.is_active=$2';
    const { rows } = await db.query(strQuery, ['available', true]);

    const properties = filterProperties(rows, type, deal, price, location);
    if (!rows.length) return badRequest(res, 'No property was found');

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
  const keys = Object.keys(body);
  let result = '';
  keys.forEach(async (key) => {
    const strQuery = `UPDATE properties SET ${key}=$1 WHERE id=$2 AND owner=$3 RETURNING *`;
    result = await db.query(strQuery, [body[key], propertyId, user.id]);
  });

  // if (files) {
  //   const response = await uploadImages(files);
  //   const strQuery = 'UPDATE properties image_url=$1 WHERE id=$2 AND owner=$3 RETURNING *';
  //   result = await db.query(strQuery, [response.images, propertyId, user.id]);
  // }
  okResponse(res, result);
};

/*
@@ Route          /api/v1//property/:propertyId/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/
export const updatePropertyAsSold = async ({ params: { propertyId }, user: { id } }, res) => {
  try {
    const strQuery = 'UPDATE properties SET status=$1 WHERE id=$2 AND owner=$3 RETURNING *';
    const { rows } = await db.query(strQuery, ['sold', propertyId, id]);

    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/property/:propertyId/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
export const activateDeactivateAdvaert = async ({ params: { propertyId } }, res) => {
  try {
    const strQuery = 'UPDATE properties SET is_active= NOT is_active WHERE id=$1 RETURNING *';
    const { rows } = await db.query(strQuery, [propertyId]);
    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:propertyId
@@ Method         DELETE
@@ Description    Delete a property advert.
*/
export const deleteProperty = async ({ params: { propertyId }, user: { id, is_admin } }, res) => {
  try {
    const strQuery = 'DELETE FROM properties WHERE id=$1 AND (owner=$2 OR $3=true) RETURNING *';
    const { rows } = await db.query(strQuery, [propertyId, id, is_admin]);

    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, { message: 'The property has been removed' });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
