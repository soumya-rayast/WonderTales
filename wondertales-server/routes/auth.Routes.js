const express = require("express");
const { signup, login, getUser } = require("../controllers/user.controller");
const authenticationToken = require("../middleware/authentication.js");

const router = express.Router();

// User signup
router.post("/signup", signup);

// User login
router.post("/login", login);

// Get user profile (protected route)
router.get("/get-user", authenticationToken, getUser);

module.exports = router;