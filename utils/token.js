import crypto from "crypto";

function generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
}

export  { generateResetToken };