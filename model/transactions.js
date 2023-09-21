const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "carts",
      require: true,
    },
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
    Total: Number,
    discountPercentage: Number,
  },
  { timestamp: true }
);
const Transaction = mongoose.model("transactions", transactionSchema);
module.exports = Transaction;
