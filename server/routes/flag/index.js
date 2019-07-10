import express from 'express';
import { flagAdd } from '../../controllers/flag';
import validate from '../../middlewares/validators';

const router = express.Router();

router.post('/', validate.flagAdvert, flagAdd);

export default router;
