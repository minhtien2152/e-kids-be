const express = require("express");
const router = express.Router();
const categoryRoutes = require("../controllers/categoryController");
const authController = require("./../controllers/authController");

//router.use(authController.protect);

router
  .route("/")
  .post(categoryRoutes.createCategory)
  .get(categoryRoutes.getAll);

router
  .route("/:id")
  .get(categoryRoutes.getOne)
  .delete(categoryRoutes.deleteCategory)
  .patch(categoryRoutes.updateCategory);

module.exports = router;
