const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const paintSchemeRouter = require("./routes/paintSchemeRoutes");
const fs = require("fs/promises");

mongoose.connect(process.env.TEST_DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));

//db.once("open", () => console.log("connected to database"));
const ENV = process.env.NODE_ENV;

app.use(express.json());

app.use("/api", (req, res) => {
  fs.readFile("endpoints.json", "utf-8").then((file) => {
    res.send(file);
  });
});

app.use("/api/paintschemes", paintSchemeRouter);

app.use((req, res) => {
  res.status(404).send({ msg: "url not found" });
});
app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else next(err);
});

//app.listen(9090, () => console.log("server started"));
module.exports = app;
