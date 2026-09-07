require("dotenv").config();

var express = require("express");
var cors = require("cors");
var logger = require("morgan");

var aplikasiRouter = require("./routes/aplikasi.routes");
var notFound = require("./middlewares/notFound");
var errorHandler = require("./middlewares/errorHandler");

var app = express();
app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/aplikasi", aplikasiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;