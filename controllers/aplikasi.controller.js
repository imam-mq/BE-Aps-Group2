const aplikasiService = require("../services/aplikasi.service");
const { createAplikasiSchema, updateAplikasiSchema } = require("../validators/aplikasi.schema");
const { firstZodMessage } = require("../utils/zodError");


// tampil data
async function getAll(req, res, next) {
    try {
        const rows = await aplikasiService.getAll();
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

// search by id
async function getById(req, res, next) {
    try {
        const row = await aplikasiService.getById(req.params.id);
        if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });
        res.json(row);
    } catch (err) {
        next(err);
    }
}

//post data
async function create(req, res, next) {
    const parsed = createAplikasiSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: firstZodMessage(parsed.error) });
    }
    try {
        const row = await aplikasiService.create(parsed.data);
        res.status(201).json(row);
    } catch (err) {
        next(err);
    }
}

// update data
async function update(req, res, next) {
    const parsed = updateAplikasiSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: firstZodMessage(parsed.error) });
    }
    try {
        const row = await aplikasiService.update(req.params.id, parsed.data);
        if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });
        res.json(row);
    } catch (err) {
        next(err);
    }
}

// delete
async function remove(req, res, next) {
    try {
        const success = await aplikasiService.remove(req.params.id);
        if (!success) return res.status(404).json({ error: "Data tidak ditemukan" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, remove };