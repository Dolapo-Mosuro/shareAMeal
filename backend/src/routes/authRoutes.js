const express = require("express");

const { register, login } = require("../controllers/authController");
const { loginLimiter } = require("../middleware/requestGuards");
const router = express.Router();

// Handle CORS preflight requests
router.options("/register", (req, res) => res.sendStatus(204));
router.options("/login", (req, res) => res.sendStatus(204));

router.post("/register", register);

router.post("/login", loginLimiter, login);
module.exports = router;
