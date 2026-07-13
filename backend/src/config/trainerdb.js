// config/trainerDb.js
const mysql = require("mysql2");

// Create a connection pool for the trainer database
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "mypassword",
  database: process.env.TRAINER_DB_NAME || "trainer",  // Use the trainer database here
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000, // 10 seconds timeout
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Trainer Database Connection Failed:", err);
  } else {
    console.log("Connected to Trainer MySQL Database");
    connection.release();
  }
});

module.exports = pool.promise();
