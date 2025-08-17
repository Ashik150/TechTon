import express from 'express';
import {createProduct,getProducts,deleteProduct,getAllProduct,createNewReview, getBestSellingProducts} from '../controllers/product.controller.js';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';

router.post('/create-product',createProduct);
router.get('/get-all-products-shop/:id',getProducts);
router.delete('/delete-shop-product/:id',deleteProduct);
router.get('/get-all-products',getAllProduct);
router.put('/create-new-review',verifyToken,createNewReview);
router.get("/get-best-selling-products", getBestSellingProducts);


export default router;
