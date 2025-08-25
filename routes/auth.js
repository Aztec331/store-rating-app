// routes/auth.js
// Defines routes for signup/login and password updates

const express = require("express");
const router = express.Router();
const { register, login, updatePassword } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { passwordUpdateRules, handleValidation } = require("../middleware/validators");

router.post("/register", register);
router.post("/login", login);
router.put("/password", auth([]), passwordUpdateRules, handleValidation, updatePassword);

module.exports = router;

