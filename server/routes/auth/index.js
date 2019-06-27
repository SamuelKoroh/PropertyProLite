import express from 'express';
import {
  signIn,
  signUp,
  sendResetLink,
  validateUrlToken,
  updateUserPassword
} from '../../controllers/auth';
import multer from '../../middleware/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);
router.post('/signin', signIn);
router.post('/reset-password', sendResetLink);
router.get('/reset-password/:token', validateUrlToken);
router.patch('/reset-password', updateUserPassword);

export default router;
