var express = require("express");
var cors = require("cors");
var logger = require("morgan");
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");
var swaggerUi = require("swagger-ui-express");

var aplikasiRouter = require("./routes/aplikasi.routes");
var authRouter = require("./routes/auth.routes");
var authMiddleware = require("./middlewares/authMiddleware");
var notFound = require("./middlewares/notFound");
var errorHandler = require("./middlewares/errorHandler");

var openapiDoc = yaml.load(
    fs.readFileSync(path.join(__dirname, "docs", "openapi.yaml"), "utf8")
);

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

// docs api (tanpa login)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiDoc, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  })
);

app.use("/api/auth", authRouter);
app.use("/api/aplikasi", authMiddleware, aplikasiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;