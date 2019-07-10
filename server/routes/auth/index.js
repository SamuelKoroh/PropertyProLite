import express from 'express';
import {
  signUp,
  signIn,
  sendResetLink,
  validateUrlToken,
  updateUserPassword
} from '../../controllers/auth';
import multer from '../../middlewares/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);
router.post('/signin', signIn);
router.post('/:email/reset-password', sendResetLink);
router.get('/:token/reset-password', validateUrlToken);
router.patch('/:token/reset-password', updateUserPassword);

export default router;
