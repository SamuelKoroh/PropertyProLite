import Joi from 'joi';

const signup = {
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

const signin = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string().required(),
  old_password: Joi.string().optional()
};

const email = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
};
const property = {
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

export default { signup, signin, property, email };
