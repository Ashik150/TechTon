import express from 'express';
import {userinfo, signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth,updateUserInfo,updateAvatar,updateUserAddress,deleteUserAddress,updatePassword} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/update-user-info', updateUserInfo);
router.put('/update-avatar', updateAvatar);
router.put('/update-user-addresses',verifyToken,updateUserAddress);
router.delete('/delete-user-address/:id',verifyToken, deleteUserAddress);
router.put('/update-user-password',verifyToken,updatePassword);
router.get('/user-info/:id',userinfo);

export default router;