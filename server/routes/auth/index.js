import express from 'express';
import { signUp, signIn, sendResetLink } from '../../controllers/auth';
import multer from '../../middlewares/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);
router.post('/signin', signIn);
router.post('/:email/reset-password', sendResetLink);

export default router;
