import ErrorHandler from "../Utils/ErrorHandler.js";
import { Order } from "../models/order.model.js";
import { Shop } from "../models/shop.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js"; 

export const createOrder = async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    //   group cart items by shopId
    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // create an order for each shop
    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllOrdersOfUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllOrdersOfSeller = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    if (req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      await updateSellerInfo(order.totalPrice - serviceCharge);

       const rewardPoints = Math.floor(order.totalPrice * 0.01);
       await User.findByIdAndUpdate(order.user._id, {
         $inc: { points: rewardPoints },
       });
    }

  order.status = req.body.status;
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.stock -= qty;
      product.sold_out += qty;

      await product.save({ validateBeforeSave: false });
    }

    async function updateSellerInfo(amount) {
      const seller = await Shop.findById(req.seller.id);

      seller.availableBalance = amount;

      await seller.save();
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const requestOrderRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const acceptOrderRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Refund successfull!",
    });

    if (req.body.status === "Refund Success") {
      // Deduct reward points (5% of order price)
      const refundPoints = Math.floor(order.totalPrice * 0.01);
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { points: -refundPoints },
      });
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.stock += qty;
      product.sold_out -= qty;

      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllOrdersForAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const getDeliveredOrders = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ status: "Delivered" });

    res.status(200).json(deliveredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductCategoryDistribution = async (req, res, next) => {
  try {
    const userEmail = req.params.email;

    // Fetch the delivered orders for the specified user
    const deliveredOrders = await Order.find({
      "user.email": userEmail,
      status: "Delivered",
    });

    // If no orders are found
    if (!deliveredOrders || deliveredOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No delivered orders found for this user.",
      });
    }

    let categoryCount = {};

    // Iterate through the orders and count the products in each category
    deliveredOrders.forEach((order) => {
      order.cart.forEach((item) => {
        const category = item.category; // Use 'category' based on your data

        // Ensure the product has a category before adding to the count
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });
    });

    // Log category count to debug


    // If no categories are found
    if (Object.keys(categoryCount).length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found in the delivered orders.",
      });
    }

    // Calculate the total number of items for percentage calculation
    const totalItems = Object.values(categoryCount).reduce(
      (sum, count) => sum + count,
      0
    );

    // Map the categories to percentage values
    const categoryPercentage = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category,
        percentage: ((count / totalItems) * 100).toFixed(2), // Keep percentage to 2 decimal places
      })
    );

    // Respond with the category distribution and percentages
    return res.status(200).json({
      success: true,
      categoryPercentage,
    });
  } catch (error) {
    console.error("Error in getProductCategoryDistribution:", error); // Log error details
    return next(new ErrorHandler(error.message, 500)); // Handle errors appropriately
  }
};




export const getUserPoints = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find all delivered orders for the user
    
    const orders = await Order.find({
      "user._id": userId,
      status: "Delivered",
    });

    // Calculate total points dynamically
    const totalPoints = orders.reduce(
      (acc, order) => acc + Math.floor(order.totalPrice * 0.01),
      0
    );

    res.status(200).json({ success: true, points: totalPoints });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
