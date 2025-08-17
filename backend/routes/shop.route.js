import express from 'express';
import {createShop,activateShop,loginShop,getSeller,logoutShop ,getShopInfo,updateSeller,updateShopAvatar} from '../controllers/shop.controller.js';
import { isSeller } from '../middleware/auth.middleware.js';
const router = express.Router();


router.post('/create-shop', createShop);
router.post('/activation', activateShop);
router.post('/login-shop',loginShop);
router.get('/getSeller',isSeller,getSeller);
router.get('/logout',isSeller,logoutShop);
router.get('/get-shop-info/:id',getShopInfo);
router.put('/update-seller-info',isSeller,updateSeller);
router.put('/update-shop-avatar',isSeller,updateShopAvatar);


export default router;

