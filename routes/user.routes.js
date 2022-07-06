const router = require("express").Router();
const userController = require("../controllers/user.controller");

/* @Signup | http://localhost:3001/api/account/signup */
router.route("/signup").post(userController.signUp);

/* @Signin | http://localhost:3001/api/account/signin */
router.route("/signin").post(userController.singIn);

/* @Signin | http://localhost:3001/api/account/signout */
router.route("/signout").post(userController.signOut);

module.exports = router;
