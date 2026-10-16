const prisma = require("../config/database");


async function logAction({ userId, aplikasiId, aplikasiNama, action, changedFields = [] }) {

    try {
        await prisma.audit_log.create({
            data: {
                user_id: userId,
                aplikasi_id: aplikasiId,
                aplikasi_nama: aplikasiNama,
                action,
                changed_fields: changedFields,
            },
        });
    } catch (err) {
        console.error("Gagal catat audit log:", err.message);

    }
    
}

module.exports = { logAction };