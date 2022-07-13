const mongoose = require("mongoose");

//mongodb+srv://8pro:<password>@cluster0.sihzxyv.mongodb.net/?retryWrites=true&w=majority

const url = `mongodb+srv://${process.env.SERVER_USERNAME}:${process.env.SERVER_PASSWORD}@${process.env.SERVER_CLUSTERNAME}.mongodb.net/${process.env.DB_NAME}`;

mongoose
  .connect(url)
  .then(() => console.log("Database connection successful"))
  .catch((e) => console.log("Database connection error" + e));

module.exports = mongoose;
