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
        required: true,
      },
      road: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    wallets_balance: {
      type: Number,
      required: false,
      min: 0,
      max: 3000,
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
