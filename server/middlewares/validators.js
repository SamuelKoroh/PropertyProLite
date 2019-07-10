import Joi from 'joi';

export const signupSchema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
  user_type: Joi.string().required(),
  image: Joi.optional()
};

export const signinSchema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string().required(),
  old_password: Joi.string().optional()
};

export const emailSchema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
};
export const propertySchema = {
  title: Joi.string().required(),
  price: Joi.number().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  type: Joi.string().required(),
  billing_type: Joi.string().required(),
  description: Joi.string().required(),
  deal_type: Joi.string().required()
};
