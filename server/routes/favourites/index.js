import express from 'express';
import { saveFavourites, getFavourites, deleteFavourite } from '../../controllers/favourites';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

router.post('/:propertyId', authenticate, saveFavourites);
router.get('/', authenticate, getFavourites);
router.delete('/:favouriteId', authenticate, deleteFavourite);

export default router;
