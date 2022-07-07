const router = require("express").Router();
const backgroundController = require("../controllers/background.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Background | http://localhost:3001/api/background */
router.route("/background").post(requireAuth, backgroundController.create);

/* @Get all | http://localhost:3001/api/backgrounds */
router.route("/backgrounds").get(backgroundController.all);

/* @Update | http://localhost:3001/api/background/:id */
router.route("/background/:id").put(requireAuth, backgroundController.update);

/* @Update | http://localhost:3001/api/background/:id */
router
  .route("/background/:id")
  .delete(requireAuth, backgroundController.delete);

module.exports = router;
