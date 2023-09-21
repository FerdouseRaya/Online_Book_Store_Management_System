const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
    role: {
      type: Number,
      require: false,
      default: 2,
    },
    verified: {
      type: Boolean,
      require: false,
      default: false,
    },
    //referencing Users Schema
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Auth = mongoose.model("auths", authSchema);
module.exports = Auth;
