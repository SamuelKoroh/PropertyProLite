import express from 'express';
import authenticate, { isAgent } from '../../middlewares/authenticate';
import multer from '../../middlewares/multer';
import {
  createAdvert,
  getProperties,
  getProperty,
  updateProperty,
  markPropertySold,
  deleteProperty
} from '../../controllers/property';

const router = express.Router();

router.get('/', getProperties);
router.get('/:propertyId', getProperty);
router.post('/', [authenticate, isAgent, multer.array('images')], createAdvert);
router.patch('/:propertyId', [authenticate, isAgent, multer.array('images')], updateProperty);
router.patch('/:propertyId/sold', [authenticate, isAgent], markPropertySold);
router.delete('/:propertyId', [authenticate, isAgent], deleteProperty);

export default router;
