const db = require("../config/db");
const lessonModel = require("./lesson.model");

// Cập nhật tất cả assignment đã hết hạn
async function cronUpdateAssignments() {
  await db.query(
    `UPDATE assignment
     SET status = 'đã hết hạn'
     WHERE due_date_end < NOW() AND status != 'đã hết hạn'
     RETURNING assignment_id, title, status, due_date_end`
  );
}

// Thêm Assignment
async function createAssignment(userId, data, role) {
  const { lesson_id, title, description, due_date_start, due_date_end, link_drive } = data;

  if (role !== 1) {
    const isOwner = await lessonModel.isCourseOwnerByLesson(userId, lesson_id);
    if (!isOwner) throw new Error("Bạn không có quyền tạo bài tập cho lesson này.");
  }

  const result = await db.query(
    `INSERT INTO assignment (lesson_id, title, description, due_date_start, due_date_end, link_drive, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'đã giao') RETURNING *`,
    [lesson_id, title, description, due_date_start, due_date_end, link_drive || null]
  );
  return result.rows[0];
}

// Cập nhật Assignment
async function updateAssignment(userId, id, data, role) {
  const { title, description, due_date_start, due_date_end, link_drive, status } = data;

  const lessonCheck = await db.query(
    `SELECT lesson_id FROM assignment WHERE assignment_id = $1`,
    [id]
  );
  if (lessonCheck.rowCount === 0) throw new Error("Không tìm thấy assignment.");
  const lesson_id = lessonCheck.rows[0].lesson_id;

  if (role !== 1) {
    const isOwner = await lessonModel.isCourseOwnerByLesson(userId, lesson_id);
    if (!isOwner) throw new Error("Bạn không có quyền sửa bài tập này.");
  }

  const result = await db.query(
    `UPDATE assignment 
     SET title = $1, description = $2, due_date_start = $3, due_date_end = $4, link_drive = $5, status = $6
     WHERE assignment_id = $7 RETURNING *`,
    [title, description, due_date_start, due_date_end, link_drive || null, status || 'đã giao', id]
  );
  return result.rows[0];
}

// Xóa Assignment
async function deleteAssignment(userId, id, role) {
  const lessonCheck = await db.query(
    `SELECT lesson_id FROM assignment WHERE assignment_id = $1`,
    [id]
  );
  if (lessonCheck.rowCount === 0) throw new Error("Không tìm thấy assignment.");
  const lesson_id = lessonCheck.rows[0].lesson_id;

  if (role !== 1) {
    const isOwner = await lessonModel.isCourseOwnerByLesson(userId, lesson_id);
    if (!isOwner) throw new Error("Bạn không có quyền xóa bài tập này.");
  }

  await db.query(`DELETE FROM assignment WHERE assignment_id = $1`, [id]);
  return { message: "Xoá assignment thành công" };
}

// Lấy tất cả Assignment của 1 lesson
async function getAssignmentsByLesson(userId, lessonId, role) {
  if (role !== 1) {
    const canView = await lessonModel.canUserViewLesson(userId, lessonId);
    if (!canView) throw new Error("Bạn không có quyền xem assignment trong lesson này.");
  }

  const result = await db.query(
    `SELECT * FROM assignment WHERE lesson_id = $1 ORDER BY assignment_id ASC`,
    [lessonId]
  );

  return await updateStatusIfExpired(result.rows);
}

// Lấy Assignment theo ID
async function getAssignmentById(userId, id, role) {
  const assignment = await db.query(
    `SELECT * FROM assignment WHERE assignment_id = $1`,
    [id]
  );
  if (assignment.rowCount === 0) return null;

  const lessonId = assignment.rows[0].lesson_id;
  if (role !== 1) {
    const canView = await lessonModel.canUserViewLesson(userId, lessonId);
    if (!canView) throw new Error("Bạn không có quyền xem assignment này.");
  }

  const assignments = await updateStatusIfExpired([assignment.rows[0]]);
  return assignments[0];
}

// Hàm cập nhật trạng thái assignment (đã hết hạn)
async function updateStatusIfExpired(assignments) {
  const now = new Date();
  return assignments.map((a) => {
    if (new Date(a.due_date_end) < now && a.status !== 'đã hết hạn') {
      a.status = 'đã hết hạn';
    }
    return a;
  });
}

// Kiểm tra user có quyền xem assignment (dùng cho submission)
async function canUserViewAssignment(userId, assignmentId) {
  const result = await db.query(
    `SELECT a.lesson_id
     FROM assignment a
     JOIN lesson l ON a.lesson_id = l.lesson_id
     JOIN course c ON l.course_id = c.course_id
     LEFT JOIN classmember cm ON c.course_id = cm.course_id
     LEFT JOIN registercourse rc ON cm.register_id = rc.register_id
     WHERE a.assignment_id = $1 AND (c.user_id = $2 OR (rc.user_id = $2 AND rc.status = 'đã thanh toán'))`,
    [assignmentId, userId]
  );
  return result.rowCount > 0;
}

async function getSubmissionByUser(assignmentId, userId) {
  const result = await db.query(
    `SELECT s.*, u.name AS student_name
     FROM submission s
     JOIN users u ON s.user_id = u.user_id
     WHERE s.assignment_id = $1 AND s.user_id = $2`,
    [assignmentId, userId]
  );
  return result.rows[0];
}

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByLesson,
  getAssignmentById,
  canUserViewAssignment,
  cronUpdateAssignments,
  getSubmissionByUser
};
