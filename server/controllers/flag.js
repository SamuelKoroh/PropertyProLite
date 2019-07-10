import { okResponse, badRequest } from '../utils/refractory';
import db from '../config/db';

/*
@@ Route          /api/v1/flag
@@ Method         POST
@@ Description    Report - flag a property advert.
*/
export const flagAdd = async ({ body }, res) => {
  try {
    const { property_id, name, email, reason, description } = body;
    const strQuery = 'INSERT INTO flag(property_id,name,email,reason,description) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const { rows } = await db.query(strQuery, [property_id, name, email, reason, description]);
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
  @@ Route          /api/v1/flag
  @@ Method         GET
  @@ Description    Get all flaged property.
  */
export const getAllFlags = async ({ query: { search } }, res) => {};
