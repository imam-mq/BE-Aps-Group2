const prisma = require("./config/database");
const { hashPassword } = require("./utils/password");

async function seed() {
  const name = process.env.ADMIN_NAME || "Admin";
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("ADMIN_USERNAME dan ADMIN_PASSWORD diisi di .env sebelum jalankan script.");
    process.exit(1);
  }

  const existing = await prisma.users.findUnique({ where: { username } });
  if (existing) {
    console.log("Akun sudah ada, tidak dibuat ulang.");
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await prisma.users.create({
    data: { name, username, password_hash: passwordHash },
  });

  console.log(`Akun admin "${username}" berhasil dibuat.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});