const { z } = require("zod");
const { todayWib, isRealDate, countDays } = require("../utils/wibDate");
const { path } = require("../app");

const activityQuerySchema = z
    .object({
        from: z.string().trim().optional().default(""),
        to: z.string().trim().optional().default(""),
    })
    .superRefine(({  from, to }, ctx) => {
        const fail = (path, message) =>
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

        if (!from) return fail("from", "Tanggal 'from' wajib diisi");
        if (!to) return fail("to", "Tanggal 'to' wajib diisi");
        if (!isRealDate(from)) return fail("from", "Format 'from' harus YYYY-MM-DD");
        if (!isRealDate(to)) return fail("to", "Format 'to' harus YYYY-MM-DD");
        if (from > to) return fail("from", "'from' tidak boleh lebih besar dari 'to'");
        if (to > todayWib()) return fail("to", "'to' tidak boleh melewati hari ini");
        if (countDays(from, to) > MAX_RANGE_DAYS) {
            return fail("to", `Rentang maksimal ${MAX_RANGE_DAYS} hari`);
        }

    });

module.exports = { activityQuerySchema };