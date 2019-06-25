import express from 'express';
import { flagAdd, getFlagById, getAllFlags, deleteFlag } from '../../controllers/flag';
import authenticate, { isAdmin } from '../../middleware/authenticate';

const router = express.Router();

router.post('/', flagAdd);
router.get('/:flagId', [authenticate, isAdmin], getFlagById);
router.get('/', [authenticate, isAdmin], getAllFlags);
router.delete('/:flagId', [authenticate, isAdmin], deleteFlag);

export default router;
