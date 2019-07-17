import uploadImages from '../utils/uploadFiles';
import { okResponse, badRequest, filterProperties } from '../utils/refractory';
import db from '../config/db';
/*
@@ Route          /api/v1/property
@@ Method         POST
@@ Description    Create a property advert.
*/
const createAdvert = async ({ user: { id }, files, body }, res) => {
  try {
    const { title, price, state, city, address, type, deal_type, billing_type, description } = body;

    // let result = await db.query('SELECT * FROM properties WHERE lower(title)=$1 AND owner=$2', [
    //   title.toLowerCase(),
    //   id
    // ]);

    // if (result.rowCount > 0) return badRequest(res, 'This property already exists', 400);

    const strQuery = 'INSERT INTO properties (title,owner,price,state,city,address,type,deal_type, '
      + 'billing_type,image_url,description) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';

    let imageUrl;
    if (files) {
      const response = await uploadImages(files);
      imageUrl = response.images;
    }

    const result = await db.query(strQuery, [
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
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1//property/
@@ Route          /api/v1//property/?type=val&price=val&location=val&deal=val
@@ Method         GET
@@ Description    Get all property adverts.
*/
const getProperties = async ({ query }, res) => {
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
@@ Route          /api/v1//property/:property_id
@@ Method         GET
@@ Description    Get all property adverts.
*/
const getProperty = async ({ params: { property_id } }, res) => {
  try {
    const strQuery = 'SELECT A.*,B.id AS owner,B.email AS owner_Email,B.phone_number AS owner_Phone'
      + ' FROM properties A INNER JOIN users B on A.owner=B.id WHERE A.id=$1 AND A.status=$2 AND A.is_active=$3';
    const { rows } = await db.query(strQuery, [property_id, 'available', true]);

    if (!rows[0]) return badRequest(res, 'The property does not exist');

    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:property_id
@@ Method         PATCH
@@ Description    Update a property advert.
*/
const updateProperty = async ({ params: { property_id }, body, files, user }, res) => {
  try {
    const { price, state, city, address, type } = body;

    let strQuery = 'UPDATE properties SET price=$1, state=$2, city=$3, address=$4, type=$5 '
      + ' WHERE id=$6 AND owner=$7 RETURNING *';

    let result = await db.query(strQuery, [
      price,
      state,
      city,
      address,
      type,
      property_id,
      user.id
    ]);

    if (files) {
      const response = await uploadImages(files);
      strQuery = 'UPDATE properties SET image_url = $1 WHERE id=$2 AND owner=$3 RETURNING *';
      result = await db.query(strQuery, [response.images, property_id, user.id]);
    }
    if (!result.rows[0]) return badRequest(res, 'The advert does not exist', 404);

    okResponse(res, result.rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:property_id/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/
const markPropertySold = async ({ params: { property_id }, user: { id } }, res) => {
  try {
    const strQuery = 'UPDATE properties SET status=$1 WHERE id=$2 AND owner=$3 RETURNING *';
    const { rows } = await db.query(strQuery, ['sold', property_id, id]);

    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1/property/:property_id/activate
@@ Method         PATCH
@@ Description    Activate user account
*/
const activateDeactivateAdvert = async ({ params: { property_id } }, res) => {
  try {
    const strQuery = 'UPDATE properties SET is_active= NOT is_active WHERE id=$1 RETURNING *';
    const { rows } = await db.query(strQuery, [property_id]);
    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
/*
@@ Route          /api/v1//property/:property_id
@@ Method         DELETE
@@ Description    Delete a property advert.
*/
const deleteProperty = async ({ params: { property_id }, user: { id, is_admin } }, res) => {
  try {
    const strQuery = 'DELETE FROM properties WHERE id=$1 AND (owner=$2 OR $3=true) RETURNING *';
    const { rows } = await db.query(strQuery, [property_id, id, is_admin]);

    if (!rows[0]) return badRequest(res, 'The operation was not successful');
    okResponse(res, { message: 'The property has been removed' });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

export default {
  createAdvert,
  updateProperty,
  deleteProperty,
  getProperty,
  getProperties,
  activateDeactivateAdvert,
  markPropertySold
};
