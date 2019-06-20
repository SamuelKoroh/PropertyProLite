import express from 'express';
import Auth from '../../controllers/auth';
import multer from '../../middleware/multer';

const router = express.Router();

const auth = new Auth();

router.post('/signup', multer.single('image'), auth.signUp);

export default router;
