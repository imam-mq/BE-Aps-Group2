const pool = require("./config/database");
const { hashPassword } = require("./utils/password");

async function seed() {
  const name = process.env.ADMIN_NAME || "Admin";
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("ADMIN_USERNAME dan ADMIN_PASSWORD diisi di .env sebelum jalankan script.");
    process.exit(1);
  }

  const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
  if (existing.rows.length > 0) {
    console.log("Akun sudah ada, tidak dibuat ulang.");
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await pool.query(
    `INSERT INTO users (name, username, password_hash) VALUES ($1, $2, $3)`,
    [name, username, passwordHash]
  );

  console.log(`Akun admin "${username}" berhasil dibuat.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});