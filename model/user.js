const mongoose = require("mongoose");

require("dotenv").config();
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
    },
  ],
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
    },
  ],
  otp: {
    type: String,
    createdAt:Date.now(),
  },
  otpCreatedAt: {
  type: Date,
  default: Date.now,
},
  isValid: {
    type: String,
    default: false,
  },
  buyItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
    },
  ],
});



const user = mongoose.model("user", userSchema);
// console.log('---------------------------------------------------------------------------------');
module.exports=user;
