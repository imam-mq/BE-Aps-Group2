const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const aplikasiRouter = require("./routes/aplikasi.routes");
const authRouter = require("./routes/auth.routes");
const dashboardRouter = require("./routes/dashboard.routes");
const authMiddleware = require("./middlewares/authMiddleware");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const openapiDoc = yaml.load(
    fs.readFileSync(path.join(__dirname, "docs", "openapi.yaml"), "utf8")
);

const app = express();

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
app.use("/api/dashboard", dashboardRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;