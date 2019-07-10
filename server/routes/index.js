import express from 'express';
import auth from './auth';
import property from './property';
import flag from './flag';
import favourites from './favourites';
import users from './users';
import dealsTypes from './dealsTypes';

const routes = express();

routes.use('/auth', auth);
routes.use('/property', property);
routes.use('/flag', flag);
routes.use('/favourites', favourites);
routes.use('/users', users);
routes.use('/deals-types', dealsTypes);

export default routes;
