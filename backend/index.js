const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
const User = require("./database/userModel.js");
const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
	console.log(`Server is running at port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const user = await User.create(name, email, password);
		console.log(user);
		res.status(201).json({
			status: "success",
			data: user,
		});
	} catch (e) {
		console.log(e);
	}
});
