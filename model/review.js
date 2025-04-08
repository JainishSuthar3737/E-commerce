const mongoose = require("mongoose");


const review = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
  content: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});


module.exports = mongoose.model("review", review);
