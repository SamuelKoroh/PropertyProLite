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
export const getFavourites = async ({ user: { id } }, res) => {};

/*
@@ Route          /api/v1/favourites/:favouriteId
@@ Method         DELETE
@@ Description    Remove the property from user favourites
*/
export const deleteFavourite = async ({ params: { favouriteId } }, res) => {};
