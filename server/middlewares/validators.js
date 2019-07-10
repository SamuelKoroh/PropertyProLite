import Joi from 'joi';
import { badRequest } from '../utils/refractory';
import schema from '../utils/validationSchemas';

const validator = (data, dataSchema, res, next) => {
  const errors = Joi.validate(data, dataSchema);
  if (errors.error) {
    const errorMSG = [];
    errors.error.details.forEach(err => errorMSG.push(err.message));
    return badRequest(res, errorMSG, 400);
  }
  next();
};

const signUp = ({ body }, res, next) => {
  validator(body, schema.signup, res, next);
};

const signIn = ({ body }, res, next) => {
  validator(body, schema.signin, res, next);
};

const resetEmail = ({ params }, res, next) => {
  validator(params, schema.email, res, next);
};

const postAdvert = ({ body }, res, next) => {
  validator(body, schema.property, res, next);
};

export default { signUp, signIn, resetEmail, postAdvert };
