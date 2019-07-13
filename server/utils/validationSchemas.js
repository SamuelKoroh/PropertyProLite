import Joi from 'joi';

const signup = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label('Email'),
  password: Joi.string()
    .required()
    .label('Password'),
  first_name: Joi.string()
    .required()
    .label('First Name'),
  last_name: Joi.string()
    .required()
    .label('Last Name'),
  phone_number: Joi.string()
    .required()
    .label('Phone number'),
  address: Joi.string()
    .required()
    .label('Address'),
  image: Joi.optional()
};

const signin = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label('Email'),
  password: Joi.string()
    .required()
    .label('Password'),
  old_password: Joi.string().optional()
};

const email = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label('Email')
};
const property = {
  title: Joi.string()
    .required()
    .label('Title'),
  price: Joi.number()
    .required()
    .label('Price'),
  state: Joi.string()
    .required()
    .label('State'),
  city: Joi.string()
    .required()
    .label('City'),
  address: Joi.string()
    .required()
    .label('Address'),
  type: Joi.string()
    .required()
    .label('Propert type'),
  billing_type: Joi.string()
    .optional()
    .label('Billing type'),
  description: Joi.string()
    .required()
    .label('Description'),
  deal_type: Joi.string()
    .required()
    .label('Deal type')
};

const flagAdvert = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
    .label('Email'),
  name: Joi.string()
    .required()
    .label('Names'),
  description: Joi.string()
    .required()
    .label('Description'),
  reason: Joi.string()
    .required()
    .label('Reason'),
  property_id: Joi.number().required()
};

export default { signup, signin, property, email, flagAdvert };
