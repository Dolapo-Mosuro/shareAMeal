const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const { AppError } = require("../middleware/errorHandler");


const normalizeRole = (value = "") => value.toString().trim().toLowerCase();
const ALLOWED_ROLES = new Set(["sme", "ngo", "sponsor"]);

const register = async (req, res, next) => {
	try {
		const { name, email, password, role, organization_name, address, phone } =
			req.body;

		if (!name || !email || !password || !role) {
			throw new AppError(
				"Name, email, password, and role are required",
				400,
				"VALIDATION_ERROR",
			);
		}

		if (password.length < 6) {
			throw new AppError(
				"Password must be at least 6 characters",
				400,
				"WEAK_PASSWORD",
			);
		}

		const normalizedRole = normalizeRole(role);
		if (!ALLOWED_ROLES.has(normalizedRole)) {
			throw new AppError("Invalid role", 400, "INVALID_ROLE");
		}

		const normalizedEmail = email.toString().trim().toLowerCase();

		const [existingUsers] = await pool.query(
			"SELECT id FROM users WHERE email = ?",
			[normalizedEmail],
		);

		if (existingUsers.length > 0) {
			throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const [result] = await pool.query(
			"INSERT INTO users (name, email, password, role, organization_name) VALUES (?, ?, ?, ?, ?)",
			[
				name,
				normalizedEmail,
				hashedPassword,
				normalizedRole, // FIX: save normalized role
				organization_name || null,
			],
		);

		
		res.status(201).json({
			message: "User registered successfully",
			userId: result.insertId,
			note: "Please check your email to verify your account. The verification link expires in 24 hours.",
		});

		
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError(
				"Email and password required",
				400,
				"VALIDATION_ERROR",
			);
		}

		const normalizedEmail = email.toString().trim().toLowerCase();

		const queryResult = await pool.query(
			"SELECT * FROM users WHERE email = ?",
			[normalizedEmail],
		);

		let users;
		if (Array.isArray(queryResult)) {
			users = Array.isArray(queryResult[0]) ? queryResult[0] : queryResult;
		} else {
			users = queryResult ? [queryResult] : [];
		}

		if (!users || users.length === 0) {
			throw new AppError("Invalid credentials", 401, "AUTH_FAILED");
		}

		const user = users[0];

		if (!user || !user.password) {
			throw new AppError("Invalid credentials", 401, "AUTH_FAILED");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AppError("Invalid credentials", 401, "AUTH_FAILED");
		}

		const normalizedUserRole = normalizeRole(user.role);

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: normalizedUserRole },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN },
		);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: normalizedUserRole,
			},
		});
	} catch (error) {
		next(error);
	}
};


const resetPassword = async (req, res, next) => {
	try {
		const { token, password } = req.body;
		if (!token || !password)
			return res.status(400).json({ message: "Token and password required" });

		const [users] = await pool.query(
			"SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
			[token],
		);

		if (!users.length)
			return res.status(400).json({ message: "Invalid or expired token" });

		const hashedPassword = await bcrypt.hash(password, 10);

		await pool.query(
			"UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
			[hashedPassword, users[0].id],
		);

		return res.json({
			message: "Password reset successful. You can now log in.",
		});
	} catch (err) {
		next(err);
	}
};

const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: "Email required" });

		const [users] = await pool.query(
			"SELECT id, name FROM users WHERE email = ?",
			[email],
		);
		if (!users.length) {
			// Always respond the same for security
			return res
				.status(200)
				.json({ message: "If this email exists, a reset link has been sent." });
		}

		const user = users[0];
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

		await pool.query(
			"UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
			[resetToken, resetTokenExpiry, user.id],
		);

		return res.json({
			message: "Password reset successful. You can now log in.",
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword,
};
