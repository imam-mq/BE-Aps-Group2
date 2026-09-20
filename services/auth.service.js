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

module.exports = { login };