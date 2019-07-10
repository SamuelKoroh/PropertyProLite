import express from 'express';
import {
  signUp,
  signIn,
  sendResetLink,
  validateUrlToken,
  updateUserPassword
} from '../../controllers/auth';
import validate from '../../middlewares/validators';
import multer from '../../middlewares/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), validate.signUp, signUp);
router.post('/signin', validate.signIn, signIn);
router.post('/:email/reset-password', validate.resetEmail, sendResetLink);
router.get('/:token/reset-password', validateUrlToken);
router.patch('/:token/reset-password', validate.signIn, updateUserPassword);

export default router;
