import mongoose from 'mongoose';

export const connection = async () => {
    try {
        const con = await mongoose.connect('mongodb://localhost:27017/GadgetMart');
        console.log(`MongoDB connected`);
    } catch (err) {
        console.log("Error: ", err.message);
        process.exit(1);
    }
}