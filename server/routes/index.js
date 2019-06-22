import express from 'express';
import users from './users';
import auth from './auth';
import property from './property';

const routes = express();

routes.use('/users', users);
routes.use('/auth', auth);
routes.use('/property', property);

export default routes;
