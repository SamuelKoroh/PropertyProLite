import express from 'express';
import { signUp } from '../../controllers/auth';
import multer from '../../middlewares/multer';

const router = express.Router();

router.post('/signup', multer.single('image'), signUp);

export default router;
