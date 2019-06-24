import express from 'express';
import authenticate, { isAgent } from '../../middleware/authenticate';
// import { isAgent, isAdmin} from '../../middleware/authenticate';
import multer from '../../middleware/multer';
import {
  createProperty,
  getProperties,
  updateProperty,
  getProperty,
  deleteProperty,
  updatePropertyAsSold
} from '../../controllers/property';

const router = express.Router();

router.post('/', [authenticate, isAgent, multer.array('images')], createProperty);
router.patch('/:propertyId/sold', [authenticate, isAgent], updatePropertyAsSold);
router.patch('/:propertyId', [authenticate, isAgent, multer.array('images')], updateProperty);
router.delete('/:propertyId', [authenticate, isAgent], deleteProperty);
router.get('/:propertyId', getProperty);
router.get('/', getProperties);

export default router;
