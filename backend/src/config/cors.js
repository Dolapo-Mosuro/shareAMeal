const cors = require("cors");

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"https://shareameal-api.vercel.app",
	process.env.FRONTEND_URL,
].filter(Boolean);

module.exports = () =>
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			if (origin.endsWith(".vercel.app")) return callback(null, true);
			return callback(new Error("Not allowed by CORS"));
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});
