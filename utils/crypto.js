const crypto = require("crypto");
const ALGO = "aes-256-gcm";

function getKey() {
    const hex = process.env.ENCRYPTION_KEY;
    if(!hex || hex.length !== 64) {
        throw new Error("ENCRYPTION_KEY harus 64 karakter hex (32 byte)");
    }
    return Buffer.from(hex, "hex");
}

function encrypt(plain) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
    const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ["enc", iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(":");
}

function decrypt(payload) {
    const [, ivB64, tagB64, dataB64] = payload.split(":");
    const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([
        decipher.update(Buffer.from(dataB64, "base64")),
        decipher.final(),
    ]).toString("utf8");
}

// enkripsi : jika nilai nya kosong
function encryptValue(value) {
    if (value === null || value === undefined || value === "") return value;
    return encrypt(String(value));
}

// deskripsinilai
function decryptValue(value) {
  if (typeof value !== "string" || !value.startsWith("enc:")) return value;
  return decrypt(value);
}

// update
function pickEncrypted(newValue, oldValue) {
  if (newValue === undefined || newValue === null) return oldValue;
  return encryptValue(newValue);
}

module.exports = { encrypt, decrypt, encryptValue, decryptValue, pickEncrypted };