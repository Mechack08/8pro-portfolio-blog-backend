const mongoose = require("mongoose");

let skillSchema = new mongoose.Schema({
  subject: {
    type: String,
    require: true,
  },
  level: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
