import express from 'express';
import { signIn, signUp } from '../../controllers/auth';
import multer from '../../middleware/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);
router.post('/signin', signIn);

export default router;
