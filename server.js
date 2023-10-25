const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

mongoose.connect(process.env.TEST_DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));

db.once("open", () => console.log("connected to database"));
const ENV = process.env.NODE_ENV;
//console.log(ENV);
app.use(express.json());

const paintSchemeRouter = require("./routes/paintSchemeRoutes");

app.use("/api/paintschemes", paintSchemeRouter);

app.listen(9090, () => console.log("server started"));
module.exports = app;
