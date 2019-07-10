import express from 'express';
import { signUp, signIn } from '../../controllers/auth';
import multer from '../../middlewares/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);
router.post('/signin', signIn);

export default router;
