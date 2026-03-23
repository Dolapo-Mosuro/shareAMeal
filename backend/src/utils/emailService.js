const nodemailer = require("nodemailer");
const crypto = require("crypto");

/**
 * Generate a random verification token
 * @returns {string} Random 32-byte hex token
 */

const EMAIL_SEND_TIMEOUT_MS = Number(
	process.env.EMAIL_SEND_TIMEOUT_MS || 15000,
);

const withTimeout = (promise, timeoutMs, context) => {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`${context} timed out after ${timeoutMs}ms`));
		}, timeoutMs);
		promise.then(
			(result) => {
				clearTimeout(timer);
				resolve(result);
			},
			(err) => {
				clearTimeout(timer);
				reject(err);
			},
		);
	});
};

const createTransporter = async () => {
	const useEthereal = process.env.USE_ETHEREAL === "true";

	if (useEthereal) {
		const testAccount = await nodemailer.createTestAccount();
		console.log("📧 Using Ethereal test account:", testAccount.user);
		return nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
	}

	// Use SendGrid (or any SMTP) in all environments
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT || 587),
		secure: process.env.SMTP_SECURE === "true",
		auth: {
			user: process.env.SMTP_USER, // must be "apikey" for SendGrid
			pass: process.env.SMTP_PASS,
		},
		connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
		greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
		socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
	});
};

async function sendResetPasswordEmail(email, name, token) {
	const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
	const transporter = await createTransporter();

	const mailOptions = {
		from: `"Share A Meal" <${process.env.SMTP_FROM}>`,
		to: email,
		subject: "Reset your password",
		html: `<p>Hello ${name},</p>
            <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
		text: `Reset your password: ${resetUrl}`,
	};

	const sendPromise = transporter.sendMail(mailOptions);
	const info = await withTimeout(
		sendPromise,
		EMAIL_SEND_TIMEOUT_MS,
		"sendResetPasswordEmail",
	);

	if (process.env.USE_ETHEREAL === "true") {
		console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
	} else {
		console.log(`✅ Reset password email sent to ${email}`);
	}

	return info;
}

module.exports = {
	
	sendResetPasswordEmail,
};
