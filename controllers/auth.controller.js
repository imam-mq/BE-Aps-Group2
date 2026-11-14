import * as authService from "../services/auth.service.js";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/users.schema.js";
import { firstZodMessage } from "../utils/zodError.js";


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

async function forgotPassword(req, res) {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: firstZodMessage(parsed.error) });
    try {
        const result = await authService.forgotPassword(parsed.data);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}

async function resetPassword(req, res) {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: firstZodMessage(parsed.error) });

    try {
        const result = await authService.resetPassword(parsed.data);
        res.json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
    
}

export { login, register, forgotPassword, resetPassword };