const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Skill | http://localhost:3001/api/comment */
router.route("/comment").post(commentController.create);

/* @Get all | http://localhost:3001/api/comments */
router.route("/comments").get(commentController.all);

/* @Update | http://localhost:3001/api/comment/:id */
router.route("/comment/:id").delete(requireAuth, commentController.delete);

module.exports = router;
