const pool = require("../config/db.js"); // Import the pool

const User = {
	// Create a new user
	create: async (name, email, password) => {
		try {
			const [result] = await pool.execute(
				"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
				[name, email, password]
			);
			return result;
		} catch (error) {
			throw error;
		}
	},

	// Find a user by email
	findByEmail: async (email) => {
		try {
			const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
				email,
			]);
			return rows[0];
		} catch (error) {
			throw error;
		}
	},

	// Find a user by ID
	findById: async (id) => {
		try {
			const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
				id,
			]);
			return rows[0];
		} catch (error) {
			throw error;
		}
	},
};

module.exports = User;
