const prisma = require("../config/database");
const { hashPassword, maskPassword, PASSWORD_MASK } = require("../utils/password");

// get seluruh data
async function getAll() {
  const rows = await prisma.aplikasi.findMany({
    where: { delete_at: null },
    orderBy: { id: "desc" },
  });
  return rows.map(maskPassword);
}

// get by id
async function getById(id) {
  const row = await prisma.aplikasi.findFirst({
    where: { id: Number(id), delete_at: null },
  });
  if (!row) return null;
  return maskPassword(row);
}

async function create(data) {
  const hashedPassword = await hashPassword(data.password_login);

  const row = await prisma.aplikasi.create({
    data: {
      nama_aplikasi: data.nama_aplikasi,
      url_link: data.url_link,
      user_login: data.user_login,
      password_login: hashedPassword,
      lokasi_server: data.lokasi_server,
      lokasi_database: data.lokasi_database,
      layanan: data.layanan,
      koneksi: data.koneksi,
      skala: data.skala,
      is_active: data.is_active,
    },
  });
  return maskPassword(row);
}

async function update(id, data) {
  const old = await prisma.aplikasi.findUnique({ where: { id: Number(id) } });
  if (!old) return null;

  let hashedPassword = old.password_login;
  if (data.password_login && data.password_login.trim() !== "" && data.password_login !== PASSWORD_MASK) {
    hashedPassword = await hashPassword(data.password_login);
  }

  const row = await prisma.aplikasi.update({
    where: { id: Number(id) },
    data: {
      nama_aplikasi: data.nama_aplikasi ?? old.nama_aplikasi,
      url_link: data.url_link ?? old.url_link,
      user_login: data.user_login ?? old.user_login,
      password_login: hashedPassword,
      lokasi_server: data.lokasi_server ?? old.lokasi_server,
      lokasi_database: data.lokasi_database ?? old.lokasi_database,
      layanan: data.layanan ?? old.layanan,
      koneksi: data.koneksi ?? old.koneksi,
      skala: data.skala ?? old.skala,
      is_active: data.is_active !== undefined ? data.is_active : old.is_active,
      updated_at: new Date(),
    },
  });

  return maskPassword(row);
}

async function remove(id) {
  const result = await prisma.aplikasi.updateMany({
    where: { id: Number(id), delete_at: null },
    data: { delete_at: new Date() },
  });

  return result.count > 0;
}

module.exports = { getAll, getById, create, update, remove };