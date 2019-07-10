import express from 'express';
import auth from './auth';

const routes = express();

routes.use('/auth', auth);

export default routes;
