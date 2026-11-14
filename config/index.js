import "dotenv/config";

const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
};

export default config;