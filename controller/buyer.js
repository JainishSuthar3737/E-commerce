// review-item, add-to-cart, like-item, add-to-wishlist
// const User = require("../model/user");
const review = require("../model/review");
const item = require("../model/item");
const mongoose = require("mongoose");
const User = require('../model/user');


exports.reviewItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is not found",
      });
    }

    const { content, rating } = req.body;

    if (!content || !rating) {
       return res.status(400).json({
        success: false,
        message: "content or rating is not found",
      });
    }

    const response = await review.create({ item: id, content, rating });

    return res.status(200).json({
      success: true,
      data: response,
      message: "rewiew uploaded",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is not found",
      });
    }
    const { id } = req.params;
    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const response = await item.findById(id).select("-password -otp -otpCreatedAt");

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: response } }, // Prevent duplicate items
      { new: true }
    ).select("-password -otp -otpCreatedAt");
   

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "item is added to cart",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.addToWish = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
     return res.status(400).json({
        success: false,
        message: "userId is not found",
      });
    }
    const { id } = req.params;
    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const response = await item.findById(id).select("-password -otp -otpCreatedAt");
    console.log(User);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: response } }, // Prevent duplicate items
      { new: true }
    ).select("-password -otp -otpCreatedAt");
   

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "item is added to Wish",
    });
  } catch (error) {
    console.log(error);

   return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.likeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user",userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is not found",
      });
    }

    const { id } = req.params;
    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const response = await item.findById(id);
    console.log(response._id);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { like: response._id } }, // Prevent duplicate items
      { new: true }
    ).select("-password -otp -otpCreatedAt");
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Item not liked",
      });
    }
 

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "item is liked",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.buyItem = async (req, res) => {
  console.log(User);
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is not found",
      });
    }

    const { id } = req.params;
    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      });
    }

    const response = await item.findById(id).select("-password -otp -otpCreatedAt");
    if (response.available_item == 0) {
     return res.status(409).json({
        success: false,
        message: "item is not available",
      });
    } else {
      response.available_item = response.available_item - 1;
      response.save()

      console.log(User);
      console.log(review);
      const updatedUser = await User.updateOne(
        { _id: userId },
        { $addToSet: { buyItem: response } }, // Prevent duplicate items
        { new: true }
      ).select("-password -otp -otpCreatedAt");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User is not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "item is added as order",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};


