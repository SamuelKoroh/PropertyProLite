"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePropertyType = exports.updatePropertyType = exports.getPropertyType = exports.getAllPropertyTypes = exports.addPropertyTypes = exports.deletePropertyDeal = exports.updatePropertyDeal = exports.getPropertyDeal = exports.getAllPropertyDeals = exports.addPropertyDeal = void 0;

var _dealType = require("../models/deal-type");

var _refractory = require("../utils/refractory");

const addPropertyDeal = ({
  body
}, res) => {
  (0, _refractory.addItem)(_dealType.PropertyDeals, body, res);
};

exports.addPropertyDeal = addPropertyDeal;

const getAllPropertyDeals = (req, res) => {
  (0, _refractory.okResponse)(res, _dealType.PropertyDeals);
};

exports.getAllPropertyDeals = getAllPropertyDeals;

const getPropertyDeal = ({
  params
}, res) => {
  (0, _refractory.getItem)(_dealType.PropertyDeals, params, res);
};

exports.getPropertyDeal = getPropertyDeal;

const updatePropertyDeal = ({
  body,
  params
}, res) => {
  (0, _refractory.updateItem)(_dealType.PropertyDeals, body, params, res);
};

exports.updatePropertyDeal = updatePropertyDeal;

const deletePropertyDeal = ({
  params
}, res) => {
  (0, _refractory.removeItem)(_dealType.PropertyDeals, params, res);
};

exports.deletePropertyDeal = deletePropertyDeal;

const addPropertyTypes = ({
  body
}, res) => {
  (0, _refractory.addItem)(_dealType.PropertyTypes, body, res);
};

exports.addPropertyTypes = addPropertyTypes;

const getAllPropertyTypes = (req, res) => {
  (0, _refractory.okResponse)(res, _dealType.PropertyTypes);
};

exports.getAllPropertyTypes = getAllPropertyTypes;

const getPropertyType = ({
  params
}, res) => {
  (0, _refractory.getItem)(_dealType.PropertyTypes, params, res);
};

exports.getPropertyType = getPropertyType;

const updatePropertyType = ({
  body,
  params
}, res) => {
  (0, _refractory.updateItem)(_dealType.PropertyTypes, body, params, res);
};

exports.updatePropertyType = updatePropertyType;

const deletePropertyType = ({
  params
}, res) => {
  (0, _refractory.removeItem)(_dealType.PropertyTypes, params, res);
};

exports.deletePropertyType = deletePropertyType;
//# sourceMappingURL=dea-type.js.map