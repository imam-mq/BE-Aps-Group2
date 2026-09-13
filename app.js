var express = require("express");
var cors = require("cors");
var logger = require("morgan");

var aplikasiRouter = require("./routes/aplikasi.routes");
var authRouter = require("./routes/auth.routes");
var authMiddleware = require("./middlewares/authMiddleware");
var notFound = require("./middlewares/notFound");
var errorHandler = require("./middlewares/errorHandler");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/aplikasi", authMiddleware, aplikasiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;