const mongoose = require("mongoose");
const express = require("express");
const app = express();
const paintSchemeRouter = require("./routes/paintSchemeRoutes");
const userProfileRouter = require("./routes/userProfileRoutes");
const provideEndpoints = require("./utils/provideEndpoints");
require("dotenv").config();

const ENV = process.env.NODE_ENV || "development";

const databaseUrl = (() => {
	switch (ENV) {
		case "test":
			return process.env.TEST_DATABASE_URL;
		case "development":
			return process.env.DEV_DATABASE_URL;
		case "production":
		default:
			return process.env.DATABASE_URL;
	}
})();

mongoose
	.connect(databaseUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

console.log("Environment variable - ", ENV);

app.use(express.json());

app.get("/api", provideEndpoints);

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
