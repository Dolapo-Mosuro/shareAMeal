const cors = require("cors");

module.exports = () =>
	cors({
		origin: "*", // Allow all origins for now (fix specific origins in production)
		credentials: false,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: "Content-Type, Authorization",
	});
