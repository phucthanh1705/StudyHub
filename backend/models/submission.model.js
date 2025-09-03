const db = require("../config/db");
const assignmentModel = require("./assignment.model");

// Thêm Submission
async function createSubmission(userId, data) {
  const { assignment_id, content, drive_link } = data;

  // Kiểm tra hạn nộp
  const assignment = await db.query(
    `SELECT due_date_end FROM assignment WHERE assignment_id = $1`,
    [assignment_id]
  );
  if (assignment.rowCount === 0) throw new Error("Không tìm thấy assignment.");

  const dueEnd = new Date(assignment.rows[0].due_date_end);
  if (new Date() > dueEnd) throw new Error("Đã quá hạn nộp bài.");

  // Kiểm tra quyền sinh viên
  const canView = await assignmentModel.canUserViewAssignment(userId, assignment_id);
  if (!canView) throw new Error("Bạn không có quyền nộp bài cho assignment này.");

  const result = await db.query(
    `INSERT INTO submission (assignment_id, user_id, content, drive_link, submitted_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING submission_id, assignment_id, user_id, content, drive_link, submitted_at`,
    [assignment_id, userId, content, drive_link || null]
  );
  return result.rows[0];
}

// Cập nhật Submission
async function updateSubmission(userId, id, data) {
  const { content, drive_link } = data;

  const submissionCheck = await db.query(
    `SELECT s.assignment_id, s.user_id, a.due_date_end
     FROM submission s
     JOIN assignment a ON s.assignment_id = a.assignment_id
     WHERE s.submission_id = $1`,
    [id]
  );
  if (submissionCheck.rowCount === 0) throw new Error("Không tìm thấy submission.");

  const submission = submissionCheck.rows[0];
  if (submission.user_id !== userId) throw new Error("Bạn không có quyền sửa bài này.");
  if (new Date() > new Date(submission.due_date_end)) throw new Error("Đã quá hạn sửa bài.");

  const result = await db.query(
    `UPDATE submission
     SET content = $1, drive_link = $2, submitted_at = NOW()
     WHERE submission_id = $3
     RETURNING submission_id, assignment_id, user_id, content, drive_link, submitted_at`,
    [content, drive_link || null, id]
  );
  return result.rows[0];
}

// Xóa Submission
async function deleteSubmission(userId, id) {
  const submissionCheck = await db.query(
    `SELECT s.assignment_id, s.user_id, a.due_date_end
     FROM submission s
     JOIN assignment a ON s.assignment_id = a.assignment_id
     WHERE s.submission_id = $1`,
    [id]
  );
  if (submissionCheck.rowCount === 0) throw new Error("Không tìm thấy submission.");

  const submission = submissionCheck.rows[0];
  if (submission.user_id !== userId) throw new Error("Bạn không có quyền xóa bài này.");
  if (new Date() > new Date(submission.due_date_end)) throw new Error("Đã quá hạn xóa bài.");

  await db.query(`DELETE FROM submission WHERE submission_id = $1`, [id]);
  return { message: "Xóa submission thành công" };
}

// Lấy tất cả Submission của 1 Assignment (Admin/Giảng viên)
async function getSubmissionsByAssignment(assignmentId) {
  const result = await db.query(
    `SELECT s.*, u.name AS student_name
     FROM submission s
     JOIN "users" u ON s.user_id = u.user_id
     WHERE s.assignment_id = $1
     ORDER BY s.submitted_at DESC`,
    [assignmentId]
  );
  return result.rows;
}

// Lấy Submission theo ID (ẩn thông tin nếu là sinh viên)
async function getSubmissionById(userId, role, id) {
  const result = await db.query(
    `SELECT s.*, u.name AS student_name
     FROM submission s
     JOIN "users" u ON s.user_id = u.user_id
     WHERE s.submission_id = $1`,
    [id]
  );
  if (result.rowCount === 0) return null;
  const submission = result.rows[0];
  if (role === 2 && submission.user_id !== userId) {
    throw new Error("Bạn không có quyền xem bài nộp này.");
  }
  return submission;
}

// Giảng viên/Admin chấm điểm và nhận xét
async function gradeSubmission(userId, role, submissionId, data) {
  const { score, feedback } = data;

  if (role !== 1 && role !== 3) {
    throw new Error("Bạn không có quyền chấm bài nộp này.");
  }

  // Kiểm tra submission và quyền giảng viên
  const check = await db.query(
    `SELECT s.submission_id, c.user_id AS teacher_id
     FROM submission s
     JOIN assignment a ON s.assignment_id = a.assignment_id
     JOIN lesson l ON a.lesson_id = l.lesson_id
     JOIN course c ON l.course_id = c.course_id
     WHERE s.submission_id = $1`,
    [submissionId]
  );
  if (check.rowCount === 0) throw new Error("Không tìm thấy bài nộp.");
  if (role === 3 && check.rows[0].teacher_id !== userId) {
    throw new Error("Bạn không có quyền chấm bài nộp này.");
  }

  const result = await db.query(
    `UPDATE submission
     SET score = $1, feedback = $2
     WHERE submission_id = $3
     RETURNING *`,
    [score, feedback, submissionId]
  );

  return result.rows[0];
}

// Lấy bài nộp của sinh viên
async function getSubmissionOfStudent(assignmentId, userId) {
  const result = await db.query(
    `SELECT s.*, u.name AS student_name
     FROM submission s
     JOIN users u ON u.user_id = s.user_id
     WHERE s.assignment_id = $1 AND s.user_id = $2
     ORDER BY s.submitted_at DESC`,
    [assignmentId, userId]
  );
  return result.rows;
}

// Lấy tất cả bài nộp của 1 user
async function getSubmissionsByUser(userId) {
  const query = `
    SELECT s.submission_id, s.assignment_id, a.title as assignment_title, 
           s.submitted_at, s.score, s.feedback
    FROM submission s
    JOIN assignment a ON s.assignment_id = a.assignment_id
    WHERE s.user_id = $1
    ORDER BY s.submitted_at DESC;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

module.exports = {
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionsByAssignment,
  getSubmissionById,
  gradeSubmission,
  getSubmissionOfStudent,
  getSubmissionsByUser
};
