const db = require("../config/db");

// Lấy tất cả người dùng
async function getAllUsers() {
  const res = await db.query("SELECT * FROM users ORDER BY user_id ASC");
  return res.rows;
}

// Lấy người dùng theo ID
async function getUserById(id) {
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid user ID");
  }

  const res = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (res.rows.length === 0) {
    throw new Error(`User with ID ${id} not found`);
  }

  return res.rows[0];
}

// Tạo người dùng mới
async function createUser({ name, email, password, role_id }) {
  const res = await db.query(
    `INSERT INTO users (name, email, password, role_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, password, role_id]
  );
  return res.rows[0];
}

// Cập nhật thông tin người dùng
async function updateUser(id, data) {
  const allowedFields = ['name', 'email', 'password', 'role_id'];
  const setFields = [];
  const values = [];
  let index = 1;

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      setFields.push(`${field} = $${index++}`);
      values.push(data[field]);
    }
  }

  if (setFields.length === 0) {
    throw new Error("Không có dữ liệu cập nhật");
  }

  setFields.push(`updated_at = NOW()`);

  values.push(id); // user_id
  const query = `
    UPDATE users
    SET ${setFields.join(", ")}
    WHERE user_id = $${index}
    RETURNING *;
  `;

  const res = await db.query(query, values);
  return res.rows[0];
}

// Xóa người dùng
async function deleteUser(id) {
  try {
    const res = await db.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    if (res.rowCount > 0) {
      return res.rows[0]; 
    }
    return null;
  } catch (err) {
    console.error("Error in deleteUser model:", err.message);
    throw err;
  }
}

// Lấy danh sách giảng viên (role_id = 3)
async function getAllTeachers() {
  const result = await db.query(
    `SELECT user_id, name, email
     FROM users
     WHERE role_id = 3
     ORDER BY name`
  );
  return result.rows;
}

// Lấy role của 1 user theo user_id
async function getUserRoleById(userId) {
  const result = await db.query(
    `SELECT r.name AS role
     FROM users u
     JOIN role r ON u.role_id = r.role_id
     WHERE u.user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllTeachers,
  getUserRoleById
};
