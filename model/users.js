const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: Number,
      required: false,
      default: 2,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      house: {
        type: String,
        required: false,
      },
      road: {
        type: String,
        required: false,
      },
      area: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    wallets_balance: {
      type: Number,
      required: false,
      default: 0,
    },
    failedLoginAttempts: {
      type: Number,
      required: false,
    },
    lastFailedLogin: {
      type: Date,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamp: true }
);
const User = mongoose.model("users", userSchema);
module.exports = User;
