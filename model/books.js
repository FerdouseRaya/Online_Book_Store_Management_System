const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    author: [
      {
        type: String,
        require: true,
      },
    ],
    ISBN: {
      type: String,
      require: true,
    },
    genre: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
      max: 2000,
    },
    discountPercentage: {
      type: Number,
      require: false,
      min: 0,
      max: 100,
      default: 0,
    },
    discountStartsDate: {
      type: Date,
      require: false,
    },
    discountEndsDate: {
      type: Date,
      require: false,
    },
    language: [
      {
        type: String,
        require: false,
      },
    ],
    pageCount: {
      type: Number,
      require: false,
    },
    availability: {
      type: Boolean,
      require: true,
    },
    bestSeller: {
      type: Boolean,
      require: false,
    },
    stock: {
      type: Number,
      requied: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        reviewId: {
          type: mongoose.Types.ObjectId,
          ref: "Review",
          required: false,
        },
        reviewContent: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Book = mongoose.model("books", bookSchema);
module.exports = Book;
