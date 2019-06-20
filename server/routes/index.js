import express from 'express';
import users from './users';
import auth from './auth';

const routes = express();

routes.use('/users', users);
routes.use('/auth', auth);

export default routes;
