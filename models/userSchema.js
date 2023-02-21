const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  subscription: {
    type: Number,
  },
  logintoken: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("USER", userSchema);

module.exports = User;
