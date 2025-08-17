import express from 'express';
import dotenv from 'dotenv';  
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { connection } from './db/connection.js';
import authRoutes from './routes/auth.route.js';
import shopRoutes from './routes/shop.route.js';
import productRoutes from './routes/product.route.js';
import eventRoutes from './routes/event.route.js';
import couponRoutes from './routes/couponCode.route.js';
import paymentRoutes from './routes/payment.route.js';
import orderRoutes from './routes/order.route.js';
import conversationRoutes from './routes/conversation.route.js';
import messageRoutes from './routes/message.route.js';
import cloudinary from 'cloudinary';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",express.static("uploads"));


app.use("/api/user",authRoutes);
app.use("/api/shop",shopRoutes);
app.use("/api/product",productRoutes);
app.use("/api/event",eventRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/conversation",conversationRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT, () => {
    connection();
    console.log('Server is running on port', PORT);
});

