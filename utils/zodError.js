function firstZodMessage(zodError) {
  return zodError.issues?.[0]?.message || "Data tidak valid";
}

module.exports = { firstZodMessage };