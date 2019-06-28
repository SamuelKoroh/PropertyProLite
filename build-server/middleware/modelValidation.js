"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emailSchema = exports.flagAddSchema = exports.createPropertySchema = exports.signinSchema = exports.signupSchema = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signupSchema = {
  email: _joi.default.string().email({
    minDomainAtoms: 2
  }).required(),
  password: _joi.default.string().required(),
  first_name: _joi.default.string().required(),
  last_name: _joi.default.string().required(),
  phone_number: _joi.default.string().required(),
  address: _joi.default.string().required(),
  user_type: _joi.default.string().required(),
  image: _joi.default.optional()
};
exports.signupSchema = signupSchema;
const signinSchema = {
  email: _joi.default.string().email({
    minDomainAtoms: 2
  }).required(),
  password: _joi.default.string().required()
};
exports.signinSchema = signinSchema;
const createPropertySchema = {
  title: _joi.default.string().required(),
  price: _joi.default.number().required(),
  state: _joi.default.string().required(),
  city: _joi.default.string().required(),
  address: _joi.default.string().required(),
  type: _joi.default.string().required(),
  billing_type: _joi.default.string().required(),
  description: _joi.default.string().required(),
  deal_type: _joi.default.string().required()
};
exports.createPropertySchema = createPropertySchema;
const flagAddSchema = {
  email: _joi.default.string().email({
    minDomainAtoms: 2
  }).required(),
  name: _joi.default.string().required(),
  description: _joi.default.string().required(),
  reason: _joi.default.string().required(),
  property_id: _joi.default.number().required()
};
exports.flagAddSchema = flagAddSchema;
const emailSchema = {
  email: _joi.default.string().email({
    minDomainAtoms: 2
  }).required()
};
exports.emailSchema = emailSchema;