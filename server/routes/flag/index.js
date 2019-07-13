import express from 'express';
import { flagAdd, getAllFlags, getFlagById, deleteFlag } from '../../controllers/flag';
import authenticate, { isAdmin } from '../../middlewares/authenticate';
import validate from '../../middlewares/validators';

const router = express.Router();

router.post('/', validate.flagAdvert, flagAdd);
router.get('/', [authenticate, isAdmin], getAllFlags);
router.get('/:flag_id', [authenticate, isAdmin], getFlagById);
router.delete('/:flag_id', [authenticate, isAdmin], deleteFlag);

export default router;
