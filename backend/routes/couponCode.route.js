import express from 'express';
import { isSeller } from '../middleware/auth.middleware.js';
import { createCouponCode,getCouponCodes,deleteCouponCode,applyCouponCode } from '../controllers/couponCode.controller.js';
const router = express.Router();

router.post('/create-coupon-code',isSeller,createCouponCode);
router.get('/get-coupon/:id',isSeller,getCouponCodes);
router.delete('/delete-coupon/:id',isSeller,deleteCouponCode);
router.get('/get-coupon-value/:name',applyCouponCode);


export default router;
