import express from 'express';
import auth from './auth';
import property from './property';
import flag from './flag';
import favourites from './favourites';

const routes = express();

routes.use('/auth', auth);
routes.use('/property', property);
routes.use('/flag', flag);
routes.use('/favourites', favourites);

export default routes;
