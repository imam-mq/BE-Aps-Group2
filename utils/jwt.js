import jwt from "jsonwebtoken";
import  config  from "../config/index.js";

function signToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "8h" });
}

function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
}

export { signToken, verifyToken };