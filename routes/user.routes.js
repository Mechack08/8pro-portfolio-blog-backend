const router = require("express").Router();
const userController = require("../controllers/user.controller");

/* @Signup | http://localhost:3001/api/account/signup */
router.route("/signup").post(userController.signUp);

module.exports = router;
