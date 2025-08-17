import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../Utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';
import ErrorHandler from '../Utils/ErrorHandler.js';
import cloudinary from 'cloudinary';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, user.verificationToken);

        res.status(201).json({
            success: true, message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true, message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "You have to verify your account!" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true, message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true, user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateUserInfo = async (req, res, next) => {
    try {
        const { email, password, phoneNumber, name } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Please provide the correct information", 400)
            );
        }

        user.name = name;
        user.phoneNumber = phoneNumber;
        //console.log(process.env.STRIPE_API_KEY);

        await user.save();

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
        const Email = req.body.email;
        const existsUser = await User.findOne({ Email });
        //console.log("User: ",existsUser);
        if (req.body.avatar !== "") {
            const imageId = existsUser.avatar.public_id;

            await cloudinary.uploader.destroy(imageId);
        }

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
        });

        existsUser.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };

        await existsUser.save();

        res.status(200).json({
            success: true,
            user: existsUser,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const updateUserAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        //console.log("User: ", user);
        const sameTypeAddress = user.addresses.find(
            (address) => address.addressType === req.body.addressType
        );
        if (sameTypeAddress) {
            return next(
                new ErrorHandler(`${req.body.addressType} address already exists`)
            );
        }

        const existsAddress = user.addresses.find(
            (address) => address._id === req.body._id
        );

        if (existsAddress) {
            Object.assign(existsAddress, req.body);
        } else {
            // add the new address to the array
            user.addresses.push(req.body);
        }

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const deleteUserAddress = async (req, res, next) => {
    try {
        const addressId = req.params.id;

        await User.updateOne(
            {
                _id: req.userId,
            },
            { $pull: { addresses: { _id: addressId } } }
        );

        const user = await User.findById(req.userId);

        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("+password");
        const isPasswordMatched = await bcryptjs.compare(req.body.oldPassword, user.password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect!", 400));
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(
                new ErrorHandler("Password doesn't matched with each other!", 400)
            );
        }
        user.password = await bcryptjs.hash(req.body.newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const userinfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
