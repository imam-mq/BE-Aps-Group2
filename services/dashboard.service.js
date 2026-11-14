import prisma from "../config/database.js";
import { toWibDateString, wibRangeToUtc } from "../utils/wibDate.js";

const RECENT_LIMIT = 5;

// kondisi Huruf besar dan kecil 
function countBy(rows, field) {
    const counts = new Map();
    for (const row of rows) {
        const key = (row[field] ?? "").trim().toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
}

// kondisi jika aplikasi di delete tidak di hiutung
async function getSummary() {
    const rows = await prisma.aplikasi.findMany({
        where: { delete_at: null },
        select: { is_active: true, layanan: true, koneksi: true, skala: true },
    });

    const total = rows.length;
    const aktif = rows.filter((row) => row.is_active === true).length;

    return {
        total,
        aktif,
        nonaktif: total - aktif,
        layanan: countBy(rows, "layanan"),
        koneksi: countBy(rows, "koneksi"),
        skala: countBy(rows, "skala"),
    };
}

// kondisi aktivitas dalam rentang tanggal
async function getActivity({  from, to }) {
    const { start, end } = wibRangeToUtc(from, to);
    const where = { action_at: { gte: start, lt: end } };

    const [rows, recentRows] = await Promise.all([
        prisma.audit_log.findMany({ where, select: { action: true, action_at: true } }),
        prisma.audit_log.findMany({
            where,
            orderBy: [{ action_at: "desc" }, { id: "desc" }],
            take: RECENT_LIMIT,
            include: { user: { select: { name: true, username: true } } },
        }),
    ]);

    // jumlah per hari tanpa aktivitas
    const byDate = new Map();
    for (const row of rows) {
        const key = row.action.toLowerCase();
        const date = toWibDateString(row.action_at);
        const day = byDate.get(date) ?? { date, create: 0, update: 0, delete: 0 };
        if (!(key in day)) continue;
        day[key] += 1;
        byDate.set(date, day);

    }

    const daily = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

    const recent = recentRows.map((row) => ({
        id: row.id,
        action: row.action,
        user: row.user.name || row.user.username,
        aplikasi: row.aplikasi_nama,
        changedFields: row.changed_fields,
        actionAt: row.action_at,
    }));

    return {  total: rows.length, daily, recent };
}

export { getSummary, getActivity };