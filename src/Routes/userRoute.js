const express = require("express");
const {
  newUser,
  loginUser,
  myReferance,
  myChildren,
  logout,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/").post(authenticate, newUser);
router.route("/me/referance").get(authenticate, myReferance);
router.route("/me/children").get(authenticate, myChildren);
router.route("/logout").get(authenticate, logout);

module.exports = router;
