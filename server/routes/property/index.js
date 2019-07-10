import express from 'express';
import authenticate, { isAgent } from '../../middlewares/authenticate';
import multer from '../../middlewares/multer';
import { createAdvert, getProperties, getProperty } from '../../controllers/property';

const router = express.Router();

router.get('/', getProperties);
router.get('/:propertyId', getProperty);
router.post('/', [authenticate, isAgent, multer.array('images')], createAdvert);

export default router;
