import { Shop } from '../models/shop.model.js';
import { sendMail } from '../Utils/sendMail.js';
import { sendShopToken } from '../Utils/shopToken.js';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../Utils/ErrorHandler.js';
import cloudinary from 'cloudinary';


export const createShop = async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };
        const activationToken = createActivationToken(seller);

        const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;
        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

export const activateShop = async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        const newSeller = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET
        );

        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } =
            newSeller;

        let seller = await Shop.findOne({ email });

        if (seller) {
            return next(new ErrorHandler("User already exists", 400));
        }
        //console.log(name, email, password, avatar, zipCode, address, phoneNumber);

        seller = await Shop.create({
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber,
        });

        sendShopToken(seller, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const loginShop = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide the all fields!", 400));
        }

        const user = await Shop.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Please provide the correct information", 400)
            );
        }

        sendShopToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getSeller = async (req, res, next) => {
    try {
        //console.log(req.seller);
        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const logoutShop = async (req, res, next) => {
    try {
        res.clearCookie("seller_token");

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getShopInfo = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return next(new ErrorHandler("Shop not found", 404));
        }

        res.status(200).json({
            success: true,
            shop,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const updateSeller = async (req, res, next) => {
    try {
        const { name, description, address, phoneNumber, zipCode } = req.body;

        const shop = await Shop.findOne(req.seller._id);

        if (!shop) {
            return next(new ErrorHandler("User not found", 400));
        }

        shop.name = name;
        shop.description = description;
        shop.address = address;
        shop.phoneNumber = phoneNumber;
        shop.zipCode = zipCode;

        await shop.save();

        res.status(201).json({
            success: true,
            shop,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const updateShopAvatar = async (req, res, next) => {
    try {
        let existsSeller = await Shop.findById(req.seller._id);

        if(existsSeller.avatar.public_id){
            const imageId = existsSeller.avatar.public_id;
            await cloudinary.uploader.destroy(imageId);
        }

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
        });

        existsSeller.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };


        await existsSeller.save();

        res.status(200).json({
            success: true,
            seller: existsSeller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

