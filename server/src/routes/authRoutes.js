const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  refreshToken
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected Routes
router.get("/me", protect, getMe);

module.exports = router;