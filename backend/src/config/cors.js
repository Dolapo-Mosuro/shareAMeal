const cors = require("cors");

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"https://share-a-meal-1p8k.vercel.app",
	"https://shareameal-api.onrender.com",
	process.env.FRONTEND_URL,
].filter(Boolean);

module.exports = () =>
	cors({
		origin: allowedOrigins,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});
