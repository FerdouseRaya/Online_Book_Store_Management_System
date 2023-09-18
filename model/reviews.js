const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      require: true,
    },
    reviews: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
      min: 0,
      max: 5,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const Review = mongoose.model("reviews", reviewSchema);
module.exports = Review;
