const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new category | http://localhost:3001/api/category */
router.route("/category").post(requireAuth, categoryController.create);

/* @Get all | http://localhost:3001/api/categories */
router.route("/categories").get(categoryController.all);

/* @Update | http://localhost:3001/api/category/:id */
router.route("/category/:id").put(requireAuth, categoryController.update);

/* @Update | http://localhost:3001/api/category/:id */
router.route("/category/:id").delete(requireAuth, categoryController.delete);

module.exports = router;
