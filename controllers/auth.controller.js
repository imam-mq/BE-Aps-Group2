const authService = require("../services/auth.service");
const { loginSchema } = require("../validators/users.schema");
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

module.exports = { login };