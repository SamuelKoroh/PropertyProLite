import express from 'express';
import multer from '../../middleware/multer';
import authenticate, { isAdmin } from '../../middleware/authenticate';
import {
  getAllUser,
  getUserProperties,
  getUserProfile,
  activateDeactivateUserProfile,
  deleteUserProfile,
  updateUserProfile
} from '../../controllers/users';

const router = express.Router();

router.get('/', [authenticate, isAdmin], getAllUser);
router.get('/me', authenticate, getUserProfile);
router.get('/:userId', getUserProperties);
router.patch('/:userId', [authenticate, multer.single('image')], updateUserProfile);
router.delete('/:userId', [authenticate, isAdmin], deleteUserProfile);
router.patch('/:userId/activate', [authenticate, isAdmin], activateDeactivateUserProfile);

export default router;
