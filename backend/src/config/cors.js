const cors = require("cors");

module.exports = () =>
	cors({
		origin: true, // Reflect the request origin
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		optionsSuccessStatus: 200,
	});
