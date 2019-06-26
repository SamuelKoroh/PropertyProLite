import express from 'express';
import multer from '../../middleware/multer';
import authenticate, { isAdmin } from '../../middleware/authenticate';
import {
  getAllUser,
  getUserProperties,
  getUserProfile,
  activateUserProfile,
  deactivateUserProfile,
  deleteUserProfile,
  updateUserProfile
} from '../../controllers/user';

const router = express.Router();

router.get('/', [authenticate, isAdmin], getAllUser);
router.get('/me', authenticate, getUserProfile);
router.get('/:userId', getUserProperties);
router.patch('/:userId', [authenticate, multer.single('image')], updateUserProfile);
router.delete('/:userId', [authenticate, isAdmin], deleteUserProfile);
router.patch('/:userId/activate', [authenticate, isAdmin], activateUserProfile);
router.patch('/:userId/deactivate', [authenticate, isAdmin], deactivateUserProfile);

export default router;
