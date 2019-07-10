import { okResponse, badRequest } from '../utils/refractory';
import db from '../config/db';
/*
@@ Route          /api/v1/favourites/:userId
@@ Method         POST
@@ Description    Add - remove property from favourite
*/
export const saveFavourites = async ({ params: { propertyId }, user: { id } }, res) => {
  try {
    const strQuery = 'INSERT INTO favourites (user_id, property_id) VALUES($1,$2)';
    await db.query(strQuery, [id, propertyId]);
    okResponse(res, { message: 'The property has been saved to your favourite list' });
  } catch (error) {
    badRequest(res, "It's like this property has been added already", 400);
  }
};
//
/*
@@ Route          /api/v1/favourites
@@ Method         GET
@@ Description    Get the login user favourite
*/
export const getFavourites = async ({ user: { id } }, res) => {
  try {
    const strQuery = 'SELECT B.id AS favourite_id, A.id AS property_id,A.owner AS owner_id, A.title,'
      + 'A.price,A.state,A.city,A.address,A.type,A.billing_type,A.deal_type,A.status,A.created_on,A.image_url '
      + ' FROM properties A INNER JOIN favourites B ON A.id = B.property_id  WHERE B.user_id=$1';

    const { rows } = await db.query(strQuery, [id]);
    if (!rows.length) return badRequest(res, 'No property on your favorite list yet');
    okResponse(res, rows);
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};

/*
@@ Route          /api/v1/favourites/:favouriteId
@@ Method         DELETE
@@ Description    Remove the property from user favourites
*/
export const deleteFavourite = async ({ params: { favouriteId } }, res) => {
  try {
    const strQuery = 'DELETE FROM favourites WHERE id=$1  RETURNING *';
    const { rows } = await db.query(strQuery, [favouriteId]);

    if (!rows[0]) return badRequest(res, 'The property does not exist');
    okResponse(res, { message: 'The property has been removed' });
  } catch (error) {
    badRequest(res, 'An unexpected error has occour', 500);
  }
};
