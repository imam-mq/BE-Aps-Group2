const pool = require("../config/database");
const { hashPassword, maskPassword, PASSWORD_MASK } = require("../utils/password");

async function getAll() {
    const result = await pool.query(
        "SELECT * FROM aplikasi WHERE delete_at IS NULL ORDER BY id DESC"
    );
    return result.rows.map(maskPassword);
}

async function getById(id) {
  const result = await pool.query(
    "SELECT * FROM aplikasi WHERE id = $1 AND delete_at IS NULL",
    [id]
  );
  if (result.rows.length === 0) return null;
  return maskPassword(result.rows[0]);
}

async function create(data) {
  const hashedPassword = await hashPassword(data.password_login);

  const result = await pool.query(
    `INSERT INTO aplikasi
      (nama_aplikasi, url_link, user_login, password_login, lokasi_server,
       lokasi_database, layanan, koneksi, skala, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      data.nama_aplikasi, data.url_link, data.user_login, hashedPassword,
      data.lokasi_server, data.lokasi_database, data.layanan, data.koneksi,
      data.skala, data.is_active,
    ]
  );

  return maskPassword(result.rows[0]);
}

async function update(id, data) {
    const existing = await pool.query("SELECT * FROM aplikasi WHERE id = $1", [id]);
    if (existing.rows.length === 0) return null;
    const old = existing.rows[0];

    let hashedPassword = old.password_login;
    if (data.password_login && data.password_login.trim() !== "" && data.password_login !== PASSWORD_MASK) {
        hashedPassword = await hashPassword(data.password_login);
    }

    const result = await pool.query(
        `UPDATE aplikasi SET
        nama_aplikasi = $1, url_link = $2, user_login = $3, password_login = $4,
        lokasi_server = $5, lokasi_database = $6, layanan = $7, koneksi = $8,
        skala = $9, is_active = $10, updated_at = NOW()
        WHERE id = $11
        RETURNING *`,
        [
        data.nama_aplikasi ?? old.nama_aplikasi, data.url_link ?? old.url_link,
        data.user_login ?? old.user_login, hashedPassword,
        data.lokasi_server ?? old.lokasi_server, data.lokasi_database ?? old.lokasi_database,
        data.layanan ?? old.layanan, data.koneksi ?? old.koneksi, data.skala ?? old.skala,
        data.is_active !== undefined ? data.is_active : old.is_active, id,
        ]
    );

    return maskPassword(result.rows[0]);
}

async function remove(id) {
    const result = await pool.query(
        "UPDATE aplikasi SET delete_at = NOW() WHERE id = $1 AND delete_at IS NULL RETURNING *",
        [id]
    );
        return result.rowCount > 0;
    }

module.exports = { getAll, getById, create, update, remove };
