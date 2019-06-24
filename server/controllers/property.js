import Joi from 'joi';
import uploadImages from '../utils/upload-files';
import Properties from '../models/Properties';
import Users from '../models/Users';
import { createPropertySchema } from '../middleware/modelValidation';

/*
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
  return res
    .status(403)
    .json({ status: 'error', error: 'You are not allow to perform this operation' });
};

/*
@@ Description    To refractor owner property retrieve from the database
*/

/*
@@ Route          /api/v1/property
@@ Method         POST
@@ Description    Create a property ad.
*/
export const createProperty = async ({ user, files, body }, res, next) => {
  try {
    const errors = Joi.validate(body, createPropertySchema);
    if (errors.error) return res.status(400).json({ status: 'error', error: errors });

    let property = Properties.find(prop => prop.title.toLowerCase() === body.title.toLowerCase());
    if (property && property.owner === user.id)
      return res.status(400).json({ status: 'error', error: 'This property already exists' });

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
    return res.status(201).json({ status: 'success', data: property });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.response });
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

  if (type)
    properties = properties.filter(p => p.title.toLowerCase().startsWith(type.toLowerCase()));

  if (deal) properties = properties.filter(p => p.deal_type.toLowerCase() === deal.toLowerCase());

  if (price) properties = properties.filter(p => parseInt(p.price, 10) <= parseInt(price, 10));

  if (location)
    properties = properties.filter(
      p =>
        p.state.toLowerCase().startsWith(location.toLowerCase())
        || p.city.toLowerCase().startsWith(location.toLowerCase())
        || p.address.toLowerCase().startsWith(location.toLowerCase())
    );

  if (!properties.length) return res.status(404).json({ status: 'error', error: 'No content' });

  properties = properties.map((property) => {
    const owner = Users.find(u => u.id === property.owner);
    return getOwnerProperty(property, owner);
  });

  res.status(200).json({ status: 200, data: properties });
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

  if (!property) return res.status(404).json({ status: 'error', error: 'Not found' });

  const owner = Users.find(u => u.id === property.owner);
  const data = getOwnerProperty(property, owner);

  res.status(200).json({ status: 200, data });
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

  if (!property) return res.status(404).json({ status: 'error', error: 'Not found' });

  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  const keys = Object.keys(body);
  keys.forEach((key) => {
    property[key] = body[key];
  });

  if (files) {
    const result = await uploadImages(files);
    property.image_url = result.images;
  }

  res.send({ status: 'success', data: property });
};

/*
@@ Route          /api/v1//property/:propertyId/sold
@@ Method         PATCH
@@ Description    Update a property advert mark status as sold.
*/
export const updatePropertyAsSold = async ({ params, user }, res) => {
  const property = Properties.find(
    prop => parseInt(prop.id, 10) === parseInt(params.propertyId, 10)
  );

  if (!property) return res.status(404).json({ status: 'error', error: 'Not found' });

  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  property.status = 'sold';

  res.send({ status: 'success', data: property });
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

  if (!property) return res.status(404).json({ status: 'error', error: 'Not found' });

  if (property.owner !== user.id && user.is_admin === false) return revokeAccess(res);

  const index = Properties.indexOf(property);
  Properties.splice(index, 1);

  res.status(200).json(Properties);
};
