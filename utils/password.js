import bcrypt from "bcryptjs";

const PASSWORD_MASK = "•••••";
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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

export { PASSWORD_MASK, PASSWORD_REGEX, hashPassword, comparePassword, maskPassword };