require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.TEST_DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));

db.once("open", () => console.log("connected to database"));
const ENV = process.env.NODE_ENV;
console.log(ENV);
app.use(express.json());

const testRouter = require("./routes/testroutes");

app.use("/testroutes", testRouter);

app.listen(9090, () => console.log("server started"));
