const router = require("express").Router();
const backgroundController = require("../controllers/background.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Background | http://localhost:3001/api/background */
router.route("/background").post(requireAuth, backgroundController.create);

module.exports = router;
