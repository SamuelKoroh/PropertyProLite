import { PropertyDeals, PropertyTypes } from '../models/deal-type';
import { okResponse, badRequest } from '../utils/refractory';

export const addPropertyDeal = ({ body }, res) => {
  const propertyDeal = { id: PropertyDeals.length + 1, ...body };
  PropertyDeals.push(propertyDeal);
  okResponse(res, propertyDeal);
};

export const getAllPropertyDeals = (req, res) => {
  okResponse(res, PropertyDeals);
};

export const getPropertyDeal = ({ params }, res) => {
  const propertyDeal = PropertyDeals.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyDeal) return badRequest(res, 'The item does not exist');
  okResponse(res, propertyDeal);
};

export const updatePropertyDeal = ({ body, params }, res) => {
  const propertyDeal = PropertyDeals.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyDeal) return badRequest(res, 'The item does not exist');
  const keys = Object.keys(body);
  keys.forEach((key) => {
    propertyDeal[key] = body[key];
  });
  okResponse(res, propertyDeal);
};

export const deletePropertyDeal = ({ params }, res) => {
  const propertyDeal = PropertyDeals.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyDeal) return badRequest(res, 'The item does not exist');
  const index = PropertyDeals.indexOf(propertyDeal);
  PropertyDeals.splice(index, 1);
  okResponse(res, { message: 'The item has been removed' });
};

export const addPropertyTypes = ({ body }, res) => {
  const propertyType = { id: PropertyTypes.length + 1, ...body };
  PropertyTypes.push(propertyType);
  okResponse(res, propertyType);
};
export const getAllPropertyTypes = (req, res) => {
  okResponse(res, PropertyTypes);
};

export const getPropertyType = ({ params }, res) => {
  const propertyType = PropertyTypes.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyType) return badRequest(res, 'The item does not exist');
  okResponse(res, propertyType);
};

export const updatePropertyType = ({ body, params }, res) => {
  const propertyType = PropertyTypes.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyType) return badRequest(res, 'The item does not exist');
  const keys = Object.keys(body);
  keys.forEach((key) => {
    propertyType[key] = body[key];
  });
  okResponse(res, propertyType);
};

export const deletePropertyType = ({ params }, res) => {
  const propertyType = PropertyTypes.find(p => parseInt(p.id, 10) === parseInt(params.id, 10));
  if (!propertyType) return badRequest(res, 'The item does not exist');
  const index = PropertyDeals.indexOf(propertyType);
  PropertyTypes.splice(index, 1);
  okResponse(res, { message: 'The item has been removed' });
};
