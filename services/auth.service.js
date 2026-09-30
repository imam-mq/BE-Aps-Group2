const prisma = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { generateResetToken } = require("../utils/token");
const { sendResetEmail } = require("../utils/mailer");


// login
async function login({ username, password }) {
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
        const error = new Error("username atau password salah");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if(!isMatch) {
        const error = new Error("username atau password salah");
        error.statusCode = 401;
        throw error;
    }


    const token = signToken({ id: user.id, username: user.username });

    return {
        token,
        user: { id: user.id, name: user.name, username: user.username },
    };
    
}

async function register({ name, username, email, password }) {
    const totalUsers = await prisma.users.count();
    if (totalUsers > 0) {
        const error = new Error("Registrasi ditutup, admin sudah terdaftar");
        error.statusCode = 403;
        throw error;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.users.create({
        data: { name, username, email, password_hash: passwordHash },
    });

    return {
        user: { id: user.id, name: user.name, username: user.username, email: user.email },
    };
}

async function forgotPassword({ email }) {
    const user = await prisma.users.findUnique({ where: { email } });

    if (user) {
        const token = generateResetToken();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

        await prisma.users.update({
            where: { id: user.id },
            data: { reset_token: token, reset_token_expires: expires },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await sendResetEmail(user.email, resetLink);
    }

    // message email
    return { message: "Jika email terdaftar, link reset password sudah dikirim" };
    
}

async function resetPassword({ token, password }) {
    const user = await prisma.users.findFirst({ where: { reset_token: token } });

    if (!user || !user.reset_token_expires || user.reset_token_expires < new Date()) {
        const error = new Error("Token tidak valid atau sudah kadaluarsa");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await hashPassword(password);

    await prisma.users.update({
        where: { id: user.id },
        data: {
            password_hash: passwordHash,
            reset_token: null,
            reset_token_expires: null,
        },
    });

    
    return { message: "Password berhasil diubah, silakan login" };
    
}

module.exports = { login, register, forgotPassword, resetPassword  };