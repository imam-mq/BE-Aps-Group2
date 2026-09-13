const { tr } = require("zod/locales");
const { verifyToken } = require("../utils/jwt");

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Token Tidak Ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token Tidak Valid Sudah Kadarluarsa"});
    }
};