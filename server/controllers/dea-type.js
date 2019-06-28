import { PropertyDeals, PropertyTypes } from '../models/deal-type';
import {
  okResponse,
  removeItem,
  updateItem,
  getItem,
  addItem
} from '../utils/refractory';

export const addPropertyDeal = ({ body }, res) => {
  addItem(PropertyDeals, body, res);
};

export const getAllPropertyDeals = (req, res) => {
  okResponse(res, PropertyDeals);
};

export const getPropertyDeal = ({ params }, res) => {
  getItem(PropertyDeals, params, res);
};

export const updatePropertyDeal = ({ body, params }, res) => {
  updateItem(PropertyDeals, body, params, res);
};

export const deletePropertyDeal = ({ params }, res) => {
  removeItem(PropertyDeals, params, res);
};

export const addPropertyTypes = ({ body }, res) => {
  addItem(PropertyTypes, body, res);
};
export const getAllPropertyTypes = (req, res) => {
  okResponse(res, PropertyTypes);
};

export const getPropertyType = ({ params }, res) => {
  getItem(PropertyTypes, params, res);
};

export const updatePropertyType = ({ body, params }, res) => {
  updateItem(PropertyTypes, body, params, res);
};

export const deletePropertyType = ({ params }, res) => {
  removeItem(PropertyTypes, params, res);
};
