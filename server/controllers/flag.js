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
export const getAllFlags = async ({ query: { search } }, res) => {
  try {
    let result;
    let strQuery = 'SELECT A.id, A.property_id, A.name, A.email, A.reason, A.description, B.title AS property,'
      + " C.id AS agent_id, CONCAT(C.first_name,' ', C.last_name) AS agent_name, A.created_on FROM flag A "
      + ' INNER JOIN properties B ON A.property_id = B.id INNER JOIN users C ON B.owner = C.id';

    if (search) {
      strQuery += ' WHERE A.name ILIKE $1 OR A.reason ILIKE $1 OR A.email ILIKE $1 ';
      result = await db.query(strQuery, [`${search}%`]);
    } else result = await db.query(strQuery);

    if (result.rowCount < 1) return badRequest(res, 'There is no matching record');
    okResponse(res, result.rows);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/flag/:flagId
@@ Method         GET
@@ Description    Get a flaged property details.
*/
export const getFlagById = async ({ params: { flagId } }, res) => {
  try {
    const strQuery = 'SELECT A.id, A.property_id, A.name, A.email, A.reason, A.description, B.title AS property,'
      + " C.id AS agent_id, CONCAT(C.first_name,' ', C.last_name) AS agent_name, A.created_on FROM flag A "
      + ' INNER JOIN properties B ON A.property_id = B.id INNER JOIN users C ON B.owner = C.id  WHERE A.id=$1';

    const { rows } = await db.query(strQuery, [flagId]);
    if (!rows[0]) badRequest(res, 'There is no matching record');
    okResponse(res, rows[0]);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
