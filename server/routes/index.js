import express from 'express';
import auth from './auth';
import property from './property';

const routes = express();

routes.use('/auth', auth);
routes.use('/property', property);

export default routes;
