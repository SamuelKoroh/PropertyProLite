import express from 'express';
import authenticate, { isAgent } from '../../middleware/authenticate';
// import { isAgent, isAdmin} from '../../middleware/authenticate';
import multer from '../../middleware/multer';
import {
  createProperty,
  getProperties,
  updateProperty,
  getProperty
} from '../../controllers/property';

const router = express.Router();

router.post('/', [authenticate, isAgent, multer.array('images')], createProperty);
router.patch('/:propertyId', updateProperty);
router.get('/:propertyId', getProperty);
router.get('/', getProperties);

export default router;
