const mongoose = require("mongoose");

let backgroundSchema = new mongoose.Schema({
  institution: {
    type: String,
    require: true,
  },
  position: {
    type: String,
    require: true,
  },
  period: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Background", backgroundSchema);
