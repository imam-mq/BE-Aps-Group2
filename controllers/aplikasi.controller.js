const bcrypt = require("bcryptjs");
const pool = require("../db");

const {
    createAplikasiSchema,
    updateAplikasiSchema,
    PASSWORD_MASK
} = require("../validators/aplikasi.schema");

function maskPassword(row) {
    if (!row) return row;
    return {
        ...row, password_login: PASSWORD_MASK
    };
}

function firstZodMessage(zodError) {
    return zodError.issues?.message || "Data tidak valid";
}

// get data aps
async function getAll(req, res, next) {
    try {
        const result = await pool.query(
            "SELECT * FROM aplikasi WHERE delete_at IS NULL ORDER BY id DESC"
        );
        res.json(result.rows.map(maskPassword));
    }catch (err) {
        next(err);
    }
}

// get aps {id}
async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM aplikasi WHERE id = $1 AND delete_at IS NULL",
            [id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({ error: "Data tidak ditemukan" });
        }
        res.json(maskPassword(result.rows[0]));
    }catch (err) {
        next(err);
    }
}

// post aps
async function create(req, res, next) {
    const parsed = createAplikasiSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: firstZodMessage(parsed.error) });
    }

    const b = parsed.data;

    try {
        const hashedPassword = await bcrypt.hash(b.password_login, 10);

        const result = await pool.query(
            `INSERT INTO aplikasi
                (nama_aplikasi, url_link, user_login, password_login, lokasi_server,
                lokasi_database, layanan, koneksi, skala, is_active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [
                b.nama_aplikasi, b.url_link, b.user_login, hashedPassword,
                b.lokasi_server, b.lokasi_database, b.layanan, b.koneksi,
                b.skala, b.is_active,
            ]
        );
        res.status(201).json(maskPassword(result.rows[0]));
    } catch(err) {
        next(err);
    }
}

// put apps 
async function update(req, res, next) {
    const { id } = req.params;
    const parsed = updateAplikasiSchema.safeParse(req.body);

    if(!parsed.success){
        return res.status(400).json({ error: firstZodMessage(parsed.error) });
    }
    const b = parsed.data;

    try {
        const existing = await pool.query("SELECT * FROM aplikasi WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Data tidak ditemukan" });
        }
        const old = existing.rows[0];

        let hashedPassword = old.password_login;
        if (b.password_login && b.password_login.trim() !== "" && b.password_login !== PASSWORD_MASK) {
            hashedPassword = await bcrypt.hash(b.password_login, 10);
        }

        const result = await pool.query(
            `UPDATE aplikasi SET
                nama_aplikasi = $1, url_link = $2, user_login = $3, password_login = $4,
                lokasi_server = $5, lokasi_database = $6, layanan = $7, koneksi = $8,
                skala = $9, is_active = $10, updated_at = NOW()
            WHERE id = $11
            RETURNING *`,
            [
                b.nama_aplikasi ?? old.nama_aplikasi, b.url_link ?? old.url_link,
                b.user_login ?? old.user_login, hashedPassword,
                b.lokasi_server ?? old.lokasi_server, b.lokasi_database ?? old.lokasi_database,
                b.layanan ?? old.layanan, b.koneksi ?? old.koneksi, b.skala ?? old.skala,
                b.is_active !== undefined ? b.is_active : old.is_active, id,
            ]
        );
        res.json(maskPassword(result.rows[0]));
    } catch(err) {
        next(err);
    }
}

// delete aps
async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE aplikasi SET delete_at = NOW() WHERE id = $1 AND delete_at IS NULL RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Data tidak ditemukan" });
        }

        res.json({ success: true });
    } catch(err){
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };