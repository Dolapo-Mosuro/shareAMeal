const { Pool } = require("pg");

const pool = new Pool(
	process.env.DATABASE_URL
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
				password: process.env.DB_PASSWORD || process.env.DB_PASS,
				database: process.env.DB_NAME || "sharemeal",
				ssl:
					process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
			},
);

const replacePlaceholders = (sql) => {
	let index = 0;
	return sql.replace(/\?/g, () => `$${++index}`);
};

const prepareQuery = (sql) => {
	const trimmedSql = sql.trim().replace(/;$/, "");
	if (/^INSERT\s+/i.test(trimmedSql) && !/\bRETURNING\b/i.test(trimmedSql)) {
		return `${trimmedSql} RETURNING id`;
	}
	return trimmedSql;
};

module.exports = {
	query: async (sql, values = []) => {
		const result = await pool.query(
			replacePlaceholders(prepareQuery(sql)),
			values,
		);
		const isRead = /^\s*(SELECT|WITH)\s+/i.test(sql);
		const rows = result.rows || [];
		const metadata = {
			...result,
			affectedRows: result.rowCount,
			changedRows: result.rowCount,
		};

		if (!isRead && rows[0]?.id !== undefined) {
			metadata.insertId = rows[0].id;
		}

		return isRead ? [rows, result.fields] : [metadata, result.fields];
	},
	end: () => pool.end(),
	pool,
};
