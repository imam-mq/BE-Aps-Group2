const prisma = require("../config/database");
const { hashPassword, maskPassword, PASSWORD_MASK } = require("../utils/password");
const { encryptValue, decryptValue, pickEncrypted } = require("../utils/crypto");
const { getIo } = require("../config/socket");
const { logAction } = require("./audit.service");

// data ke FE
function toResponse(row) {
  return maskPassword({
    ...row,
    user_login: decryptValue(row.user_login),
    lokasi_server: decryptValue(row.lokasi_server),
    lokasi_database: decryptValue(row.lokasi_database),
  });
}

const TRACKED_FIELDS = [
  "nama_aplikasi", "url_link", "user_login", "password_login",
  "lokasi_server", "lokasi_database", "layanan", "koneksi", "skala", "is_active",
];
const ENCRYPTED_FIELDS = ["user_login", "lokasi_server", "lokasi_database"];

function norm(v) {
  return v === null || v === undefined ? "" : String(v);
}

function getChangedFields(before, after) {
  return TRACKED_FIELDS.filter((field) => {
    let a = before[field];
    let b = after[field];
    if (ENCRYPTED_FIELDS.includes(field)) {
      a = decryptValue(a);
      b = decryptValue(b);
    }
    return norm(a) !== norm(b);
  });
}

// get seluruh data
async function getAll({ search, layanan, status, koneksi, skala, page, limit }) {
  const where = { delete_at: null };

  // hanya nama_aplikasi & url_link
  if (search) {
    where.OR = [
      { nama_aplikasi: { contains: search, mode: "insensitive" } },
      { url_link: { contains: search, mode: "insensitive" } },
    ];
  }

  if (layanan) where.layanan = { equals: layanan, mode: "insensitive" };
  if (koneksi) where.koneksi = { equals: koneksi, mode: "insensitive" };
  if (skala) where.skala = { equals: skala, mode: "insensitive" };
  if (status === "aktif") where.is_active = true;
  if (status === "nonaktif") where.is_active = false;

  const [rows, total] = await prisma.$transaction([
    prisma.aplikasi.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.aplikasi.count({ where }),
  ]);

  return {
    data: rows.map(toResponse),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
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

async function create(data, userId) {
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

  await logAction({
    userId,
    aplikasiId: row.id,
    aplikasiNama: row.nama_aplikasi,
    action: "CREATE",
  });

  getIo().emit("aplikasi:changed", { action: "created", id: row.id });
  return toResponse(row);
}

async function update(id, data, userId) {
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

  const changedFields = getChangedFields(old, row);
  if (changedFields.length > 0) {
    await logAction({
      userId,
      aplikasiId: row.id,
      aplikasiNama: row.nama_aplikasi,
      action: "UPDATE",
      changedFields,
    });
  }

  getIo().emit("aplikasi:changed", { action: "updated", id: row.id });
  return toResponse(row);
}

async function remove(id, userId) {
  const old = await prisma.aplikasi.findFirst({
    where: { id: Number(id), delete_at: null },
  });
  if (!old) return false;

  await prisma.aplikasi.update({
    where: { id: old.id },
    data: { delete_at: new Date() },
  });

  await logAction({
    userId,
    aplikasiId: old.id,
    aplikasiNama: old.nama_aplikasi,
    action: "DELETE",
  });

  getIo().emit("aplikasi:changed", { action: "deleted", id: old.id });
  return true;
}

module.exports = { getAll, getById, create, update, getByNamaAplikasi, remove };