import express from 'express';
import authenticate, { isAgent, isAdmin } from '../../middlewares/authenticate';
import multer from '../../middlewares/multer';
import validate from '../../middlewares/validators';
import property from '../../controllers/property';

const router = express.Router();

router.get('/', property.getProperties);
router.get('/:property_id', property.getProperty);

router.post(
  '/',
  [authenticate, isAgent, multer.array('images'), validate.postAdvert],
  property.createAdvert
);

router.patch(
  '/:property_id',
  [authenticate, isAgent, multer.array('images')],
  property.updateProperty
);

router.patch('/:property_id/sold', [authenticate, isAgent], property.markPropertySold);
router.patch('/:property_id/activate', [authenticate, isAdmin], property.activateDeactivateAdvert);
router.delete('/:property_id', [authenticate, isAgent], property.deleteProperty);

export default router;
