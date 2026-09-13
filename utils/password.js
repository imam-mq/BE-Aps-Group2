const bcrypt = require("bcryptjs");

const PASSWORD_MASK = "•••••";

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}


function maskPassword(row) {
  if (!row) return row;
  return { ...row, password_login: PASSWORD_MASK };
}

module.exports = { PASSWORD_MASK, hashPassword, comparePassword, maskPassword };