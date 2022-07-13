const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.SERVER_USERNAME}:${process.env.SERVER_PASSWORD}@${process.env.SERVER_CLUSTERNAME}.mongodb.net/${process.env.DB_NAME}`;

mongoose
  .connect(url)
  .then(() => console.log("Database connection successful"))
  .catch((e) => console.log("Database connection error" + e));

module.exports = mongoose;
