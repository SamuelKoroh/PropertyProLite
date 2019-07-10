import { okResponse, badRequest } from '../utils/refractory';
import db from '../config/db';
/*
@@ Route          /api/v1/deals-types/deals
@@ Method         POST
@@ Description    Add new deal
*/
export const addPropertyDeal = async ({ body: { name, description } }, res) => {
  try {
    const id = name.toLowerCase().replace(' ', '-');
    const strQuery = 'INSERT INTO deals(id,name,description) VALUES($1,$2,$3) RETURNING *';
    const { rows } = await db.query(strQuery, [id, name, description]);
    okResponse(res, rows[0], 201);
  } catch (error) {
    badRequest(res, 'It likes this item already exist', 400);
  }
};

/*
@@ Route          /api/v1/deals-types/deals
@@ Method         Get
@@ Description    Get all deals
*/
export const getAllPropertyDeals = async (req, res) => {
  try {
    const strQuery = 'SELECT * FROM deals';
    const { rows } = await db.query(strQuery);
    okResponse(res, rows);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};

/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         Get
@@ Description    Get a deal
*/
export const getPropertyDeal = async ({ params: { id } }, res) => {
  try {
    const strQuery = 'SELECT * FROM deals WHERE id=$1';
    const { rows } = await db.query(strQuery, [id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         PATCH
@@ Description    Update a deal
*/
export const updatePropertyDeal = async ({ body: { name, description }, params: { id } }, res) => {
  try {
    const strQuery = 'UPDATE deals SET name=$1,description=$2 WHERE id=$3 RETURNING *';
    const { rows } = await db.query(strQuery, [name, description, id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         DELETE
@@ Description    Delete a deal
*/
export const deletePropertyDeal = async ({ params: { id } }, res) => {
  try {
    const strQuery = 'DELETE FROM deals WHERE id=$1 RETURNING *';
    const { rows } = await db.query(strQuery, [id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, { message: 'The item has been deleted' });
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};

/*
@@ Route          /api/v1/deals-types/types
@@ Method         POST
@@ Description    Add new type
*/
export const addPropertyTypes = async ({ body: { name, description } }, res) => {
  try {
    const id = name.toLowerCase().replace(' ', '-');
    const strQuery = 'INSERT INTO types(id,name,description) VALUES($1,$2,$3) RETURNING *';
    const { rows } = await db.query(strQuery, [id, name, description]);
    okResponse(res, rows[0], 201);
  } catch (error) {
    badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/types
@@ Method         Get
@@ Description    Get all types
*/
export const getAllPropertyTypes = async (req, res) => {
  try {
    const strQuery = 'SELECT * FROM types';
    const { rows } = await db.query(strQuery);
    okResponse(res, rows);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         GET
@@ Description    Get  type
*/
export const getPropertyType = async ({ params: { id } }, res) => {
  try {
    const strQuery = 'SELECT * FROM types WHERE id=$1';
    const { rows } = await db.query(strQuery, [id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         UPDATE
@@ Description    Update type
*/
export const updatePropertyType = async ({ body: { name, description }, params: { id } }, res) => {
  try {
    const strQuery = 'UPDATE types SET name=$1,description=$2 WHERE id=$3 RETURNING *';
    const { rows } = await db.query(strQuery, [name, description, id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, rows[0]);
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         DELETE
@@ Description    Delete  type
*/
export const deletePropertyType = async ({ params: { id } }, res) => {
  try {
    const strQuery = 'DELETE FROM types WHERE id=$1 RETURNING *';
    const { rows } = await db.query(strQuery, [id]);
    if (!rows[0]) return badRequest(res, 'Item not found');
    okResponse(res, { message: 'The item has been deleted' });
  } catch (error) {
    // badRequest(res, 'It likes this item already exist', 400);
  }
};
