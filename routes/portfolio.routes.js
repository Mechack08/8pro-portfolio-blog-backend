const router = require("express").Router();
const portfolioController = require("../controllers/portfolio.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Portfolio | http://localhost:3001/api/portfolio */
router
  .route("/portfolio")
  .post(requireAuth, portfolioController.upload, portfolioController.create);

/* @Get all | http://localhost:3001/api/portfolios */
router.route("/portfolios").get(portfolioController.all);

/* @Update | http://localhost:3001/api/portfolio/:id */
router.route("/portfolio/:id").put(requireAuth, portfolioController.update);

/* @Update Img | http://localhost:3001/api/portfolio/img/:id */
router
  .route("/portfolio/img/:id")
  .put(requireAuth, portfolioController.upload, portfolioController.updateImg);

/* @Update | http://localhost:3001/api/portfolio/:id */
router.route("/portfolio/:id").delete(requireAuth, portfolioController.delete);

module.exports = router;
