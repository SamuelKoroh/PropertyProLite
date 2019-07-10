import express from 'express';
import {
  addPropertyDeal,
  getPropertyDeal,
  getAllPropertyDeals,
  updatePropertyDeal,
  deletePropertyDeal,
  addPropertyTypes,
  getAllPropertyTypes,
  getPropertyType,
  updatePropertyType,
  deletePropertyType
} from '../../controllers/dealsTypes';
import authenticate, { isAdmin } from '../../middlewares/authenticate';

const router = express.Router();

router.post('/deals', [authenticate, isAdmin], addPropertyDeal);
router.get('/deals', [authenticate, isAdmin], getAllPropertyDeals);
router.get('/deals/:id', [authenticate, isAdmin], getPropertyDeal);
router.patch('/deals/:id', [authenticate, isAdmin], updatePropertyDeal);
router.delete('/deals/:id', [authenticate, isAdmin], deletePropertyDeal);
router.post('/types', [authenticate, isAdmin], addPropertyTypes);
router.get('/types', [authenticate, isAdmin], getAllPropertyTypes);
router.get('/types/:id', [authenticate, isAdmin], getPropertyType);
router.patch('/types/:id', [authenticate, isAdmin], updatePropertyType);
router.delete('/types/:id', [authenticate, isAdmin], deletePropertyType);

export default router;
