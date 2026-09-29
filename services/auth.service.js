const prisma = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");


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

module.exports = { login, register };