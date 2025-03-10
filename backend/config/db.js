const mysql = require("mysql2");

const pool = mysql.createPool({
	host: process.env.DB_HOST || "127.0.0.1",
	user: process.env.DB_USER || "myuser",
	password: process.env.DB_PASSWORD || "mypassword",
	database: process.env.DB_NAME || "pokedex",
	port: process.env.DB_PORT || 3306,
	connectTimeout: 10000, // 10 seconds timeout
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

module.exports = pool.promise();
