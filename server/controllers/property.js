import Joi from 'joi';
import uploadImages from '../utils/upload-files';
import Properties from '../models/Properties';
import { createPropertySchema } from '../middleware/modelValidation';

/*
@@ Route          /api/v1//property/<:property-id>/
@@ Method         GET
@@ Description    Get all property adverts.
*/
// export const getProperties = (req, res, next) => {
//   return res.send('all properties');
// };

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

export const updateProperty = (req, res, next) => {
  //   return res.send('update property');
};
