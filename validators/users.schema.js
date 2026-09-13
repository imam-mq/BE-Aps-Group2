const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().trim().min(1, "Nama Wajib Diisi"),
    username: z.string().trim().min(3, "Username minimal 3 karakter"),
    password: z.string().min(8, "Password minimal 8 Karakter"),
});

const loginSchema = z.object({
    username: z.string().trim().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
});

module.exports = { registerSchema, loginSchema };