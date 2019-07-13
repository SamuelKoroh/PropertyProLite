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
router.get('/:user_id', getUserProperties);
router.delete('/:user_id', [authenticate, isAdmin], deleteUserProfile);
router.patch('/:user_id/activate', [authenticate, isAdmin], activateDeactivateUserProfile);
router.patch('/:user_id/set-admin', [authenticate, isAdmin], makeRemoveUserAdmin);

export default router;
