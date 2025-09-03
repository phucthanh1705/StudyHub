const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userRes = await db.query("SELECT * FROM users WHERE user_id = $1", [
      decoded.id,
    ]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    req.user = {
      id: userRes.rows[0].user_id,
      role: Number(userRes.rows[0].role_id),
    };

    next(); // Không kiểm tra quyền ở đây
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ", error });
  }
};
