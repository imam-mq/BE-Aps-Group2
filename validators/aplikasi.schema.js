const { z } = require("zod");
const { PASSWORD_MASK } = require("../utils/password");

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const skalaEnum = z.enum(["Kecil", "Sedang", "Besar"]);

// add data baru post

const createAplikasiSchema = z.object({
    nama_aplikasi: z.string().trim().min(1, "Nama Aplikasi wajib diisi"),
    url_link: z.string().trim().optional().default(""),
    user_login: z.string().trim().optional().default(""),
    password_login: z.string().regex(PASSWORD_REGEX, "password minimal 8 karakter serta kombinasi dengan angka"),
    lokasi_server: z.string().trim().optional().default(""),
    lokasi_database: z.string().trim().optional().default(""),
    layanan: z.string().trim().optional().default(""),
    koneksi: z.string().trim().optional().default(""),
    skala: skalaEnum.optional().default("Kecil"),
    is_active: z.boolean().optional().default(true),
});

// update data put
const updateAplikasiSchema = z
    .object({
        nama_aplikasi: z.string().trim().min(1, "Nama Aplikasi wajib diisi").optional(),
        url_link: z.string().trim().optional(),
        user_login: z.string().trim().optional(),
        password_login: z.string().optional(),
        lokasi_server: z.string().trim().optional(),
        lokasi_database: z.string().trim().optional(),
        layanan: z.string().trim().optional(),
        koneksi: z.string().trim().optional(),
        skala: skalaEnum.optional(),
        is_active: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.password_login &&
            data.password_login.trim() !== "" &&
            data.password_login !== PASSWORD_MASK &&
            !PASSWORD_REGEX.test(data.password_login)
        ){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password_login"],
                message: "password minimal 8 karakter serta kombinasi dengan angka",
            });
        }
    })
module.exports = { PASSWORD_MASK, createAplikasiSchema, updateAplikasiSchema };
