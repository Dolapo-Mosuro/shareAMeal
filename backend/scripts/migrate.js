#!/usr/bin/env node

const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

require("dotenv").config({
	path:
		process.env.NODE_ENV === "test"
			? ".env.test"
			: process.env.NODE_ENV === "production"
				? ".env.production"
				: ".env",
});

async function ensureUsersVerificationColumns(connection) {
	const { rows: columns } = await connection.query(
		`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'`,
	);

	const existing = new Set(columns.map((row) => row.column_name));
	const alterParts = [];

	if (!existing.has("is_verified")) {
		alterParts.push("ADD COLUMN is_verified BOOLEAN DEFAULT FALSE");
	}

	if (!existing.has("verification_token")) {
		alterParts.push("ADD COLUMN verification_token VARCHAR(255)");
	}

	if (!existing.has("verification_token_expires")) {
		alterParts.push("ADD COLUMN verification_token_expires TIMESTAMP");
	}

	if (alterParts.length === 0) {
		console.log("✅ users table already has verification columns");
		return;
	}

	const alterSql = `ALTER TABLE users ${alterParts.join(", ")}`;
	await connection.query(alterSql);
	console.log("🛠️ Added missing verification columns to users table");
}

async function runMigration() {
	let connection;

	try {
		console.log("🔄 Starting database migration...");
		const config = process.env.DATABASE_URL
			? {
					connectionString: process.env.DATABASE_URL,
					ssl:
						process.env.DB_SSL === "false"
							? false
							: { rejectUnauthorized: false },
				}
			: {
					host: process.env.DB_HOST || "localhost",
					port: process.env.DB_PORT || 5432,
					user: process.env.DB_USER || "postgres",
					password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
					database: process.env.DB_NAME || "sharemeal",
					ssl:
						process.env.DB_SSL === "true"
							? { rejectUnauthorized: false }
							: false,
				};

		connection = new Client(config);
		await connection.connect();
		console.log("✅ Connected to PostgreSQL");

		const schemaPath = path.join(__dirname, "../db/migrations/shareAMeal.sql");

		if (!fs.existsSync(schemaPath)) {
			throw new Error(`Schema file not found at ${schemaPath}`);
		}

		const schema = fs.readFileSync(schemaPath, "utf8");

		const statements = schema
			.split(";")
			.map((stmt) => stmt.trim())
			.filter((stmt) => stmt.length > 0);

		console.log(`📄 Running ${statements.length} SQL statements...`);

		for (const statement of statements) {
			try {
				await connection.query(statement);
			} catch (error) {
				// Allow idempotent re-runs for tables/indexes that already exist
				if (error.code === "42P07" || error.code === "42710") {
					console.warn(
						"Skipping migration statement because object already exists:",
						statement,
					);
					continue;
				}

				throw error;
			}
		}

		// Backfill verification columns when deploying to existing databases.
		await ensureUsersVerificationColumns(connection);

		const { rows: tables } = await connection.query(
			"SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
		);
		console.log(
			"📋 Tables in current database:",
			tables.map((row) => row.tablename),
		);

		console.log("✅ Database schema migration completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Migration failed:", {
			message: error.message || "No error message returned",
			code: error.code,
			detail: error.detail,
			hint: error.hint,
		});
		process.exit(1);
	} finally {
		if (connection) {
			await connection.end();
		}
	}
}

runMigration();
