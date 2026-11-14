import express from "express";
import cors from "cors";
import logger from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import aplikasiRouter from "./routes/aplikasi.routes.js";
import authRouter from "./routes/auth.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

export default app;