const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const authController = require("./../controllers/authController");

//router.use(authController.protect);
router.route("/:id").get(progressController.getOne);
router.route("/:id/:idword").patch(progressController.updateProgress);

module.exports = router;
