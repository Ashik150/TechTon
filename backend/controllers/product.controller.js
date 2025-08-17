import cloudinary from 'cloudinary';
import { Product } from '../models/product.model.js';
import { Shop } from '../models/shop.model.js';
import { Order } from '../models/order.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

export const createProduct = async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler('Shop not found', 400));
        } else {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            const productData = req.body;
            productData.images = imagesLinks;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not found', 400));
        }

        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.uploader.destroy(
                product.images[i].public_id
            );
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        if (!products || products.length === 0) {
            return next(new ErrorHandler('No products found', 404));  // Error if no products found
        }

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const createNewReview = async (req, res, next) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;

        const product = await Product.findById(productId);

        const review = {
            user,
            rating,
            comment,
            productId,
        };

        const isReviewed = product.reviews.find(
            (rev) => rev.user._id === req.userId
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user._id === req.userId) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        } else {
            product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
            orderId,
            { $set: { "cart.$[elem].isReviewed": true } },
            { arrayFilters: [{ "elem._id": productId }], new: true }
        );

        res.status(200).json({
            success: true,
            message: "Reviwed succesfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
};
export const getBestSellingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sold_out: { $gt: 1 } })
      .sort({ sold_out: -1 }) 
      .limit(5); 
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};


