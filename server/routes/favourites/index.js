import express from 'express';
import { saveFavourites, getFavourites, deleteFavourite } from '../../controllers/favourites';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

router.post('/:property_id', authenticate, saveFavourites);
router.get('/', authenticate, getFavourites);
router.delete('/:favourite_id', authenticate, deleteFavourite);

export default router;
