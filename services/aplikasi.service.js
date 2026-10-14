const prisma = require("../config/database");
const { hashPassword, maskPassword, PASSWORD_MASK } = require("../utils/password");
const { encryptValue, decryptValue, pickEncrypted } = require("../utils/crypto");
const { getIo } = require("../config/socket");

// data ke FE
function toResponse(row) {
  return maskPassword({
    ...row,
    user_login: decryptValue(row.user_login),
    lokasi_server: decryptValue(row.lokasi_server),
    lokasi_database: decryptValue(row.lokasi_database),
  });
}

// get seluruh data
async function getAll() {
  const rows = await prisma.aplikasi.findMany({
    where: { delete_at: null },
    orderBy: { id: "desc" },
  });
  return rows.map(toResponse);
}

// get by id
async function getById(id) {
  const row = await prisma.aplikasi.findFirst({
    where: { id: Number(id), delete_at: null },
  });
  if (!row) return null;
  return toResponse(row);
}

// get by namaaplikasi
async function getByNamaAplikasi(nama) {
  const rows = await prisma.aplikasi.findMany({
    where: { 
      nama_aplikasi: { contains: nama, mode: "insensitive" },
      delete_at: null,
    },
    orderBy: { id: "desc" },
  });
  return rows.map(toResponse);
}


async function create(data) {
  const row = await prisma.aplikasi.create({
    data: {
      nama_aplikasi: data.nama_aplikasi,
      url_link: data.url_link,
      user_login: encryptValue(data.user_login),
      password_login: encryptValue(data.password_login),
      lokasi_server: encryptValue(data.lokasi_server),
      lokasi_database: encryptValue(data.lokasi_database),
      layanan: data.layanan,
      koneksi: data.koneksi,
      skala: data.skala,
      is_active: data.is_active,
    },
  });
  getIo().emit("aplikasi:changed", { action: "created", id: row.id });
  return toResponse(row);
}

async function update(id, data) {
  const old = await prisma.aplikasi.findUnique({ where: { id: Number(id) } });
  if (!old) return null;

  let passwordEnc = old.password_login;
  if (data.password_login && data.password_login.trim() !== "" && data.password_login !== PASSWORD_MASK) {
    passwordEnc = encryptValue(data.password_login);
  }

  const row = await prisma.aplikasi.update({
    where: { id: Number(id) },
    data: {
      nama_aplikasi: data.nama_aplikasi ?? old.nama_aplikasi,
      url_link: data.url_link ?? old.url_link,
      user_login: pickEncrypted(data.user_login, old.user_login),
      password_login: passwordEnc,
      lokasi_server: pickEncrypted(data.lokasi_server, old.lokasi_server),
      lokasi_database: pickEncrypted(data.lokasi_database, old.lokasi_database),
      layanan: data.layanan ?? old.layanan,
      koneksi: data.koneksi ?? old.koneksi,
      skala: data.skala ?? old.skala,
      is_active: data.is_active !== undefined ? data.is_active : old.is_active,
      updated_at: new Date(),
    },
  });
  getIo().emit("aplikasi:changed", { action: "updated", id: row.id });
  return toResponse(row);
}

async function remove(id) {
  const result = await prisma.aplikasi.updateMany({
    where: { id: Number(id), delete_at: null },
    data: { delete_at: new Date() },
  });

  const deleted = result.count > 0;
  if (deleted) {
    getIo().emit("aplikasi:changed", { action: "deleted", id: Number(id) });
  }
  return deleted;
}

module.exports = { getAll, getById, create, update, getByNamaAplikasi, remove };