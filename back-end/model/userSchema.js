const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  activeState: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("user", userSchema);
