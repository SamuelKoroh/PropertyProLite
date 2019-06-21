import express from 'express';
import Auth from '../../controllers/auth';
import multer from '../../middleware/multer';

const auth = new Auth();
const router = express.Router();

router.post('/signup', multer.single('image'), auth.signUp);
router.post('/signin', auth.signIn);

export default router;
