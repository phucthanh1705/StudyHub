const pool = require("../config/db");

exports.createOTP = async (email, otp, expiresAt) => {
  const res = await pool.query(
    "INSERT INTO otp_codes (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *",
    [email, otp, expiresAt]
  );
  return res.rows[0];
};

exports.findOTP = async (email, otp) => {
  const res = await pool.query(
    "SELECT * FROM otp_codes WHERE email=$1 AND otp=$2",
    [email, otp]
  );
  return res.rows[0];
};

exports.deleteOTP = async (email) => {
  await pool.query("DELETE FROM otp_codes WHERE email=$1", [email]);
};
