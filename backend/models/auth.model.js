const db = require("../config/db");

// Tìm người dùng theo email
async function findUserByEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email");
  }

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) {
    return null; // Không tìm thấy user
  }

  return result.rows[0];
}

// Export
module.exports = {
  findUserByEmail,
};
