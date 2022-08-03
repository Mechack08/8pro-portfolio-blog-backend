const router = require("express").Router();
const articleController = require("../controllers/article.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Article | http://localhost:3001/api/article */
router
  .route("/article")
  .post(requireAuth, articleController.upload, articleController.create);

/* @Get all | http://localhost:3001/api/articles */
router.route("/articles").get(articleController.all);

/* @Update | http://localhost:3001/api/article/:id */
router.route("/article/:id").put(requireAuth, articleController.update);

/* @Update Img | http://localhost:3001/api/article/img/:id */
router
  .route("/article/img/:id")
  .patch(requireAuth, articleController.upload, articleController.updateImg);

/* @Update | http://localhost:3001/api/article/:id */
router.route("/article/:id").delete(requireAuth, articleController.delete);

/* @Add a comment | http://localhost:3001/api/add/comment/:id */
router.route("/add/comment/:id").put(articleController.addComment);

/* @Delete a comment | http://localhost:3001/api/delete/comment/:id */
router.route("/delete/comment/:id").delete(articleController.deleteComment);

module.exports = router;
