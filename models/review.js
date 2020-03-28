const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now()
  }
});

const review = mongoose.model("review", reviewSchema);

module.exports = review;
