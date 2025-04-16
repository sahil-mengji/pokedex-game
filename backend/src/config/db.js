const mysql = require("mysql2");

let io = null; // for broadcasting

const pool = mysql.createPool({
	host: process.env.DB_HOST || "127.0.0.1",
	user: process.env.DB_USER || "myuser",
	password: process.env.DB_PASSWORD || "mypassword",
	database: process.env.DB_NAME || "pokedex",
	port: process.env.DB_PORT || 3306,
	connectTimeout: 10000,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error("Database Connection Failed:", err);
	} else {
		console.log("Connected to MySQL Database");
		connection.release();
	}
});

const createLoggingPool = (socketIOInstance) => {
	io = socketIOInstance;

	const promisePool = pool.promise();
	const originalQuery = promisePool.query.bind(promisePool);

	promisePool.query = async (...args) => {
		const sql = args[0];
		const params = args[1];

		const queryLog = {
			query: typeof sql === "string" ? sql : sql.sql,
			params,
			timestamp: new Date().toISOString(),
		};

		// Log in terminal
		console.log("Executing query:", queryLog.query);
		if (params) console.log("Query parameters:", params);

		// Emit via socket to frontend
		if (io) {
			io.emit("sql_log", queryLog);
		}

		try {
			const result = await originalQuery(...args);
			console.log(
				"------------------------------------------------------------"
			);
			return result;
		} catch (error) {
			console.error("Query failed:", error);
			if (io) {
				io.emit("sql_log", { ...queryLog, error: error.message });
			}
			throw error;
		}
	};

	return promisePool;
};

module.exports = createLoggingPool;
