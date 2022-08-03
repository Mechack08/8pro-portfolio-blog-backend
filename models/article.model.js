const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      require: true,
    },
    category: { type: String },
    author: { type: String },
    content: {
      type: String,
      require: true,
    },
    img: {
      type: String,
    },
    comments: {
      type: [
        {
          fullname: String,
          email: String,
          comment: String,
          timestamp: Number,
        },
      ],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Article", articleSchema);
