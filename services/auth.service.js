const pool = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function register({ name, username, password }) {
    const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (existing.rows.length > 0) {
        const error = new Error("Username sudah dipakai");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
        `INSERT INTO users (name, username, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, name, username, created_at`,
        [name, username, passwordHash]
    );

    return result.rows[0];
}

async function login({ username, password }) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if(result.rows.length === 0) {
        const error = new Error("Username atau password salah");
        error.statusCode = 401;
        throw error;
    }

    const user = result.rows[0];
    const isMatch = await comparePassword(password, user.password_hash);
    if(!isMatch) {
        const error = new Error("Username atau password salah");
        error.statusCode = 401;
        throw error;
    }

    const token = signToken({ id: user.id, username: user.username });

    return {
        token,
        user: { id: user.id, name: user.name, username: user.username },
    };
}

module.exports = { register, login };