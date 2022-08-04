const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Get User ID | http://localhost:3001/api/account/get-id */
router.route("/get-id").get(requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

/* @Signup | http://localhost:3001/api/account/signup */
router.route("/signup").post(userController.signUp);

/* @Signin | http://localhost:3001/api/account/signin */
router.route("/signin").post(userController.singIn);

/* @Signin | http://localhost:3001/api/account/signout */
router.route("/signout").post(userController.signOut);

/* @Signin | http://localhost:3001/api/account/get-infos */
router.route("/get-infos").get(requireAuth, userController.getUserInfos);

module.exports = router;
