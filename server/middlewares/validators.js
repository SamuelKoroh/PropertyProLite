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
  password: Joi.string().required()
};

export const emailSchema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
};
