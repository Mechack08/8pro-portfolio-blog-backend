const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    validate: (value) => {
      return validator.isEmail(value);
    },
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    max: 1024,
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
