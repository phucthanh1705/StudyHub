const db = require('../config/db');

// Tạo mới
async function createSubject(data) {
  const { name, description } = data;
  const result = await db.query(
    'INSERT INTO subject (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [name, description]
  );
  return result.rows[0];
}

// Lấy tất cả
async function getAllSubjects() {
  const result = await db.query('SELECT * FROM subject ORDER BY subject_id ASC');
  return result.rows;
}

// Lấy theo ID
async function getSubjectById(id) {
  const result = await db.query('SELECT * FROM subject WHERE subject_id = $1', [id]);
  return result.rows[0];
}

// Cập nhật
async function updateSubject(id, data) {
  const { name, description } = data;
  const result = await db.query(
    'UPDATE subject SET name = $1, description = $2 WHERE subject_id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0];
}

// Xóa
async function deleteSubject(id) {
  await db.query('DELETE FROM subject WHERE subject_id = $1', [id]);
  return { message: 'Subject deleted successfully' };
}

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
