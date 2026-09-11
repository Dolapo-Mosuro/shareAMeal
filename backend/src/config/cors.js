const cors = require("cors");

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

const configuredOrigins = (process.env.CORS_ORIGINS || "")
	.split(",")
	.map(normalizeOrigin)
	.filter(Boolean);

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"https://share-a-meal-1p8k.vercel.app",
	"https://sharemeals.vercel.app",
	"https://shareameal-api.vercel.app",
	"https://shareameal-api.onrender.com",
	normalizeOrigin(process.env.FRONTEND_URL),
	...configuredOrigins,
].filter(Boolean);

module.exports = () =>
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(normalizeOrigin(origin))) {
				return callback(null, true);
			}
			if (typeof origin === "string" && origin.endsWith(".vercel.app")) {
				return callback(null, true);
			}
			return callback(null, false);
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		optionsSuccessStatus: 204,
	});
