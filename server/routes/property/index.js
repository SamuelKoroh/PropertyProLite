import express from 'express';
import authenticate, { isAgent, isAdmin } from '../../middlewares/authenticate';
import multer from '../../middlewares/multer';
import validate from '../../middlewares/validators';
import property from '../../controllers/property';

const router = express.Router();

router.get('/', property.getProperties);
router.get('/:propertyId', property.getProperty);

router.post(
  '/',
  [authenticate, isAgent, multer.array('images'), validate.postAdvert],
  property.createAdvert
);

router.patch(
  '/:propertyId',
  [authenticate, isAgent, multer.array('images')],
  property.updateProperty
);

router.patch('/:propertyId/sold', [authenticate, isAgent], property.markPropertySold);
router.patch('/:propertyId/activate', [authenticate, isAdmin], property.activateDeactivateAdvert);
router.delete('/:propertyId', [authenticate, isAgent], property.deleteProperty);

export default router;
