import express from 'express';
import { flagAdd, getAllFlags } from '../../controllers/flag';
import authenticate, { isAdmin } from '../../middlewares/authenticate';
import validate from '../../middlewares/validators';

const router = express.Router();

router.post('/', validate.flagAdvert, flagAdd);
router.get('/', [authenticate, isAdmin], getAllFlags);

export default router;
