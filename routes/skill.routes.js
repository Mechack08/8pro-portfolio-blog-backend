const router = require("express").Router();
const skillController = require("../controllers/skill.controller");
const { requireAuth } = require("../utils/jwt.utils");

/* @Create a new Skill | http://localhost:3001/api/skill */
router.route("/skill").post(requireAuth, skillController.create);

/* @Get all | http://localhost:3001/api/skills */
router.route("/skills").get(skillController.all);

/* @Update | http://localhost:3001/api/skill/:id */
router.route("/skill/:id").put(requireAuth, skillController.update);

/* @Update | http://localhost:3001/api/skill/:id */
router.route("/skill/:id").delete(requireAuth, skillController.delete);

module.exports = router;
