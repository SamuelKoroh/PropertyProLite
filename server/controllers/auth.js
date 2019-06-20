import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Users from '../models/Users';
import cloudinary from 'cloudinary';
import { signupSchema } from '../middleware/modelValidation';

class Auth {
  /*
    @Endpoint /api/

    */
  async signUp(req, res) {
    const { body, file } = req;
    const errors = Joi.validate(body, signupSchema);

    if (errors.error) {
      return res
        .status(400)
        .json({ status: 'error', error: errors.error.details[0].message });
    }

    let user = Users.find(u => u.email === body.email);
    if (user) {
      return res.status(400).json({
        status: 'error',
        error: 'This email has been registered already'
      });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);
      user = { id: Users.length + 1, ...body, password };

      if (file) {
        const result = await cloudinary.v2.uploader.upload(file.path);
        user.image = result.secure_url;
      }

      Users.push(user);

      let data = _.omit(user, ['password']);
      data.token = await jwt.sign(data, 'jwtsecret', { expiresIn: 3600 });

      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return res.send(error);
    }
  }
}

export default Auth;
