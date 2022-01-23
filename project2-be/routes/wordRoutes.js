const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordCotroller");
const authController = require("./../controllers/authController");

//router.use(authController.protect);

router.route("/").post(wordController.createWord).get(wordController.getAll);

router
  .route("/:id")
  .get(wordController.getOne)
  .delete(wordController.deleteWord)
  .patch(wordController.updateWord);

module.exports = router;
