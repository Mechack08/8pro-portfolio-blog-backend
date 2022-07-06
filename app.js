require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3001;

const userRoute = require("./routes/user.routes");
const backgroundRoute = require("./routes/background.routes");

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

app.get("/api/", (req, res) => {
  res.send("Welcome ! 8pro Portfolio and Blog");
});

/* @Routes */
app.use("/api/account", userRoute);
app.use("/api", backgroundRoute);

app.listen(port, () => {
  console.log(`Listening on url: http://localhost:${port}`);
});
