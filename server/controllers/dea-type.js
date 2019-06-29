import { PropertyDeals, PropertyTypes } from '../models/deal-type';
import { okResponse, removeItem, updateItem, getItem, addItem } from '../utils/refractory';

/*
@@ Route          /api/v1/deals-types/deals
@@ Method         POST
@@ Description    Add new deal
*/
export const addPropertyDeal = ({ body }, res) => {
  addItem(PropertyDeals, body, res);
};

/*
@@ Route          /api/v1/deals-types/deals
@@ Method         Get
@@ Description    Get all deals
*/
export const getAllPropertyDeals = (req, res) => {
  okResponse(res, PropertyDeals);
};

/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         Get
@@ Description    Get a deal
*/
export const getPropertyDeal = ({ params }, res) => {
  getItem(PropertyDeals, params, res);
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         PATCH
@@ Description    Update a deal
*/
export const updatePropertyDeal = ({ body, params }, res) => {
  updateItem(PropertyDeals, body, params, res);
};
/*
@@ Route          /api/v1/deals-types/deals/:id
@@ Method         DELETE
@@ Description    Delete a deal
*/
export const deletePropertyDeal = ({ params }, res) => {
  removeItem(PropertyDeals, params, res);
};

/*
@@ Route          /api/v1/deals-types/types
@@ Method         POST
@@ Description    Add new type
*/
export const addPropertyTypes = ({ body }, res) => {
  addItem(PropertyTypes, body, res);
};
/*
@@ Route          /api/v1/deals-types/types
@@ Method         Get
@@ Description    Get all types
*/
export const getAllPropertyTypes = (req, res) => {
  okResponse(res, PropertyTypes);
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         GET
@@ Description    Get  type
*/
export const getPropertyType = ({ params }, res) => {
  getItem(PropertyTypes, params, res);
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         UPDATE
@@ Description    Update type
*/
export const updatePropertyType = ({ body, params }, res) => {
  updateItem(PropertyTypes, body, params, res);
};
/*
@@ Route          /api/v1/deals-types/types/:id
@@ Method         DELETE
@@ Description    Delete  type
*/
export const deletePropertyType = ({ params }, res) => {
  removeItem(PropertyTypes, params, res);
};
