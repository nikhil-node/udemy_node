const express = require("express");
const userController = require("../controllers/useController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

module.exports = router;
