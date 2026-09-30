const { z, email } = require("zod");
const { PASSWORD_REGEX } = require("../utils/password");

const registerSchema = z.object({
    name: z.string().trim().min(1, "Nama Wajib Diisi"),
    username: z.string().trim().min(3, "Username minimal 3 karakter"),
    email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi").regex(PASSWORD_REGEX, "Password minimal 8 karakter serta kombinasi dengan angka"),
});

const loginSchema = z.object({
    username: z.string().trim().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
});

const forgotPasswordSchema = z.object({
    email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid"),
});

const resetPasswordSchema = z.object({
    token: z.string().trim().min(1, "Token tidak valid"),
    password: z.string().min(1, "Password wajib diisi").regex(PASSWORD_REGEX, "Password minimal 8 karakter serta kombinasi dengan angka"),
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema  };