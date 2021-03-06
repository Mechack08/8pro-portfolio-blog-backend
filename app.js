require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./config/mongodb.db");

const app = express();

const userRoute = require("./routes/user.routes");
const backgroundRoute = require("./routes/background.routes");
const skillRoute = require("./routes/skill.routes");
const portfolioRoute = require("./routes/portfolio.routes");
const categoryRoute = require("./routes/category.routes");
// const articleRoute = require("./routes/article.routes");
// const commentRoute = require("./routes/comment.routes");

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.json())
  .use(cookieParser())
  .use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  )
  .use("/api/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome ! 8pro Portfolio and Blog");
});

/* @Routes */
app.use("/api/account", userRoute);
app.use("/api", backgroundRoute);
app.use("/api", skillRoute);
app.use("/api", portfolioRoute);
app.use("/api", categoryRoute);
// app.use("/api", articleRoute);
// app.use("/api", commentRoute);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on url: http://localhost:3001`);
});
