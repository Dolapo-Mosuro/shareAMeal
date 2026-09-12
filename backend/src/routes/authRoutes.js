const express = require("express");

const {
	register,
	login,
	forgotPassword,
	resetPassword,
	// verifyEmail,
	// resendVerification,
} = require("../controllers/authController");
const { loginLimiter } = require("../middleware/requestGuards");
const {
	sanitizeAuthPayload,
	validateUserRegistration,
	validateUserLogin,
} = require("../middleware/validate");
const router = express.Router();

router.post(
	"/register",
	sanitizeAuthPayload,
	validateUserRegistration,
	register,
);

router.post(
	"/login",
	sanitizeAuthPayload,
	validateUserLogin,
	loginLimiter,
	login,
);

// // Email verification endpoint
// router.get("/verify/:token", verifyEmail);

// // Resend verification email
// router.post("/resend-verification", resendVerification); // keep before any protected routes

// Forgot password endpoint
router.post("/forgot-password", forgotPassword);
// Reset password endpoint
router.post("/reset-password", resetPassword);

module.exports = router;
