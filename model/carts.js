const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    books: {
      type: [
        {
          book: {
            type: mongoose.Types.ObjectId,
            ref: "books",
          },
          quantity: Number,
          _id: false,
        },
      ],
    },
    Total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;
