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
} from '../../controllers/dea-type';

const router = express.Router();

router.post('/deals', addPropertyDeal);
router.get('/deals', getAllPropertyDeals);
router.get('/deals/:id', getPropertyDeal);
router.patch('/deals/:id', updatePropertyDeal);
router.delete('/deals/:id', deletePropertyDeal);
router.post('/types', addPropertyTypes);
router.get('/types', getAllPropertyTypes);
router.get('/types/:id', getPropertyType);
router.patch('/types/:id', updatePropertyType);
router.delete('/types/:id', deletePropertyType);

export default router;
