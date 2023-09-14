const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
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
  },
  {
    timestamps: true,
  }
);
const Auth = mongoose.model("auths", authSchema);
module.exports = Auth;
