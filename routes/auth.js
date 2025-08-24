// routes/auth.js
// Defines routes for signup/login

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Signup
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;
