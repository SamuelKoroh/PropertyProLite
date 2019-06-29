import _ from 'lodash';
import Favourites from '../models/Favourites';
import { okResponse, badRequest } from '../utils/refractory';
import Properties from '../models/Properties';

const getFavourite = (favouritePropertyId, user) => {
  return Favourites.find(
    f =>
      (parseInt(f.id, 10) === parseInt(favouritePropertyId, 10)
        && parseInt(f.user_id, 10) === parseInt(user.id, 10))
      || (parseInt(f.property_id, 10) === parseInt(favouritePropertyId, 10)
        && parseInt(f.user_id, 10) === parseInt(user.id, 10))
  );
};
const removeFavourite = (favourite) => {
  const index = Favourites.indexOf(favourite);
  Favourites.splice(index, 1);
  return 'The property has been removed';
};

/*
@@ Route          /api/v1/favourites/:userId
@@ Method         POST
@@ Description    Add - remove property from favourite
*/
export const saveFavourites = ({ params, user }, res) => {
  const { propertyId } = params;
  let favourite = getFavourite(propertyId, user);
  if (favourite) return okResponse(res, { message: removeFavourite(favourite) });
  favourite = { id: Favourites.length + 1, user_id: user.id, property_id: propertyId };
  Favourites.push(favourite);
  okResponse(res, { message: 'The property has been saved to your favourite list' });
};

/*
@@ Route          /api/v1/favourites
@@ Method         GET
@@ Description    Get the login user favourite
*/
export const getFavourites = ({ user }, res) => {
  const favourites = Favourites.filter(f => parseInt(f.user_id, 10) === parseInt(user.id, 10));
  if (!favourites.length) return badRequest(res, 'No property on your favorite list yet');
  const myFavourites = favourites.map((f) => {
    const property = Properties.find(p => parseInt(p.id, 10) === parseInt(f.property_id, 10));
    return {
      favorite_id: f.id,
      property_id: property.id,
      owner_id: property.owner,
      ..._.omit(property, ['id', 'owner'])
    };
  });
  okResponse(res, myFavourites);
};

/*
@@ Route          /api/v1/favourites/:favouriteId
@@ Method         DELETE
@@ Description    Remove the property from user favourites
*/
export const deleteFavourite = ({ params, user }, res) => {
  const favourite = getFavourite(params.favouriteId, user);
  if (!favourite) return badRequest(res, 'The property does not exist', 404);
  okResponse(res, { message: removeFavourite(favourite) });
};
