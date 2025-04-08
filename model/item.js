const mongoose = require("mongoose");


const items = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }],
  available_item: {
    type: Number,
    default:0
  },
  discount: {
    type: String,
  },
  imageUrl: {
    type: String,
  }
});


module.exports = mongoose.model("items", items);