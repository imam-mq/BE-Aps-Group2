const authService = require("../services/auth.service");
const { loginSchema, registerSchema  } = require("../validators/users.schema");
const { firstZodMessage } = require("../utils/zodError");


async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: firstZodMessage(parsed.error) });
    }
    try {
        const result = await authService.login(parsed.data);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message});
    }
}


async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: firstZodMessage(parsed.error) });
    try {
        const result = await authService.register(parsed.data);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}

module.exports = { login, register };