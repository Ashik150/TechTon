import cloudinary from 'cloudinary';
import { Shop } from '../models/shop.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';
import { Event } from '../models/event.model.js';

export const createEvent = async (req, res, next) => {
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

            const event = await Event.create(productData);

            res.status(201).json({
                success: true,
                event,
            });
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ shopId: req.params.id });

        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new ErrorHandler('Event not found', 400));
        }
        for (let i = 0; i < event.images.length; i++) {
            const result = await cloudinary.uploader.destroy(
                event.images[i].public_id
            );
        }

        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};