import express from 'express';
import multer from '../../middlewares/multer';
import authenticate, { isAdmin } from '../../middlewares/authenticate';
import {
  getAllUser,
  getUserProperties,
  getUserProfile,
  activateDeactivateUserProfile,
  deleteUserProfile,
  updateUserProfile,
  makeRemoveUserAdmin
} from '../../controllers/users';

const router = express.Router();

router.get('/', [authenticate, isAdmin], getAllUser);
router.patch('/', [authenticate, multer.single('image')], updateUserProfile);
router.get('/me', authenticate, getUserProfile);
router.get('/:userId', getUserProperties);
router.delete('/:userId', [authenticate, isAdmin], deleteUserProfile);
router.patch('/:userId/activate', [authenticate, isAdmin], activateDeactivateUserProfile);
router.patch('/:userId/set-admin', [authenticate, isAdmin], makeRemoveUserAdmin);

export default router;
