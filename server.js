const mongoose = require("mongoose");
const express = require("express");
const app = express();
const paintSchemeRouter = require("./routes/paintSchemeRoutes");
const userProfileRouter = require("./routes/userProfileRoutes");
require("dotenv").config();

mongoose
	.connect(process.env.TEST_DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

const ENV = process.env.NODE_ENV;
console.log(ENV);

app.use(express.json());

app.use("/api/paintschemes", paintSchemeRouter);

app.use("/api/userprofiles", userProfileRouter);

app.use((req, res) => {
	res.status(404).send({ msg: "url not found" });
});

app.use((err, request, response, next) => {
	if (err.name === "CastError") {
		response.status(400).send({
			msg: "An error occured, please check you entered the correct data.",
		});
	} else if (err.status && err.msg) {
		response.status(err.status).send({ msg: err.msg });
	} else next(err);
});

module.exports = app;
