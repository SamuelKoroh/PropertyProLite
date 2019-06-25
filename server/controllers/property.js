import Joi from 'joi';
import uploadImages from '../utils/upload-files';
import Properties from '../models/Properties';
import Users from '../models/Users';
import { createPropertySchema } from '../middleware/modelValidation';
import { okResponse, badRequest } from '../utils/refractory';

// ///////////////////////////////////////////////////////////////////
/* This region is for code refractory
@@ Description    To refractor owner property retrieve from the database
*/
const getOwnerProperty = (property, owner) => {
  return {
    ...property,
    owner: owner.first_name.concat(' ', owner.last_name),
    ownerEmail: owner.email,
    ownerPhoneNumber: owner.phone_number
  };
};
/*
@@ Description    Revoke user ffrom changing the state of a property if not it's owner
*/
const revokeAccess = (res) => {
  return badRequest(res, 'You are not allow to perform this operation', 403);
};

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
export const createProperty = async ({ user, files, body }, res) => {
  try {
    const errors = Joi.validate(body, createPropertySchema);
    if (errors.error) return badRequest(res, errors, 400);

    let property = Properties.find(prop => prop.title.toLowerCase() === body.title.toLowerCase());
    if (property && property.owner === user.id)
      return badRequest(res, 'This property already exists', 400);

    property = {
      id: Properties.length + 1,
      ...body,
      owner: user.id,
      status: 'available',
      created_on: Date.now()
    };

    if (files) {
      const result = await uploadImages(files);
      property.image_url = result.images;
    }
    Properties.push(property);
    return okResponse(res, property, 201);
  } catch (error) {
    badRequest(res, 'Server Error', 500);
  }
};

/*
@@ Route          /api/v1//property/
@@ Route          /api/v1//property/?type=val&price=val&location=val&deal=val
@@ Method         GET
@@ Description    Get all property adverts.
*/
export const getProperties = (req, res) => {
  const { location, type, deal, price } = req.query;
  let properties = Properties.filter(p => p.status !== 'sold');

  properties = filterProperties(properties, type, deal, price, location);
  if (!properties.length) return badRequest(res, 'No property was found');

  properties = properties.map((property) => {
    const owner = Users.find(u => u.id === property.owner);
    return getOwnerProperty(property, owner);
  });
  okResponse(res, properties);
};

/*
@@ Route          /api/v1//property/:propertyId
@@ Method         GET
@@ Description    Get all property adverts.
*/
export const getProperty = ({ params }, res) => {
  const property = Properties.find(
    prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10) && prop.status !== 'sold'
  );
  if (!property) return badRequest(res, 'The property does not exist');
  const owner = Users.find(u => u.id === property.owner);
  const data = getOwnerProperty(property, owner);
  okResponse(res, data);
};

/*
@@ Route          /api/v1//property/:propertyId
@@ Method         PATCH
@@ Description    Update a property advert.
*/
export const updateProperty = async ({ params, body, files, user }, res) => {
  const property = Properties.find(
    prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10)
  );
  if (!property) return badRequest(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  const keys = Object.keys(body);
  keys.forEach((key) => {
    property[key] = body[key];
  });

  if (files) {
    const result = await uploadImages(files);
    property.image_url = result.images;
  }
  okResponse(res, property);
};

/*
@@ Route          /api/v1//property/:propertyId/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/
export const updatePropertyAsSold = ({ params, user }, res) => {
  const property = Properties.find(
    prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10)
  );
  if (!property) return badRequest(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);
  property.status = 'sold';
  okResponse(res, property);
};

/*
@@ Route          /api/v1//property/:propertyId
@@ Method         DELETE
@@ Description    Delete a property advert.
*/
export const deleteProperty = ({ params, user }, res) => {
  const property = Properties.find(
    prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10)
  );

  if (!property) return badRequest(res, 'The property does not exist');
  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  const index = Properties.indexOf(property);
  Properties.splice(index, 1);

  okResponse(res, { message: 'The property has been removed' });
};
