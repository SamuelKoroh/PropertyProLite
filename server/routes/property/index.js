import express from 'express';
import authenticate, { isAdmin } from '../../middlewares/authenticate';
import multer from '../../middlewares/multer';
import validate from '../../middlewares/validators';
import property from '../../controllers/property';

const router = express.Router();

router.get('/', authenticate, property.getProperties);
router.get('/:property_id', authenticate, property.getProperty);

router.post(
  '/',
  [authenticate, multer.array('image_url'), validate.postAdvert],
  property.createAdvert
);

router.patch('/:property_id', [authenticate, multer.array('image_url')], property.updateProperty);

router.patch('/:property_id/sold', [authenticate], property.markPropertySold);
router.patch('/:property_id/activate', [authenticate, isAdmin], property.activateDeactivateAdvert);
router.delete('/:property_id', [authenticate], property.deleteProperty);

export default router;
