const db = require("../config/db");
require("dotenv").config();

// Format dữ liệu trả về (đường dẫn tương đối)
function formatLessonFile(lesson) {
  if (lesson?.file) {
    lesson.file_pdf = `/uploads/lessons/${lesson.file}`;
  }
  return lesson;
}

// ================== CRUD ==================
async function createLesson(userId, data, role) {
  const { title, content, file, course_id } = data;

  if (role !== 1) {
    const isOwner = await isCourseOwnerByCourse(userId, course_id);
    if (!isOwner) {
      return { message: "Bạn không có quyền thêm bài học cho khoá học này." };
    }
  }

  const result = await db.query(
    `INSERT INTO lesson (title, content, file, course_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, file, course_id]
  );

  return formatLessonFile(result.rows[0]);
}

async function updateLesson(userId, id, data, role) {
  if (role !== 1) {
    const isOwner = await isCourseOwner(userId, id);
    if (!isOwner) {
      return { message: "Bạn không có quyền sửa bài học này." };
    }
  }

  const { title, content, file } = data;
  let result;
  if (file) {
    result = await db.query(
      `UPDATE lesson SET title=$1, content=$2, file=$3 WHERE lesson_id=$4 RETURNING *`,
      [title, content, file, id]
    );
  } else {
    result = await db.query(
      `UPDATE lesson SET title=$1, content=$2 WHERE lesson_id=$3 RETURNING *`,
      [title, content, id]
    );
  }
  return formatLessonFile(result.rows[0]);
}

async function deleteLesson(userId, id, role) {
  if (role !== 1) {
    const isOwner = await isCourseOwner(userId, id);
    if (!isOwner) {
      return { message: "Bạn không có quyền xoá bài học này." };
    }
  }

  await db.query(`DELETE FROM lesson WHERE lesson_id=$1`, [id]);
  return { message: "Xoá bài học thành công" };
}

// ================== GET ==================
async function getAllLessons(userId, courseId, role) {
  if (role !== 1) {
    const isOwner = await isCourseOwnerByCourse(userId, courseId);
    if (!isOwner) {
      return { message: "Bạn không có quyền xem bài học của khoá học này." };
    }
  }

  const result = await db.query(
    `SELECT * FROM lesson WHERE course_id=$1 ORDER BY lesson_id ASC`,
    [courseId]
  );
  return result.rows.map(row => formatLessonFile(row));
}

async function getLessonById(userId, id, role) {
  if (role !== 1) {
    const isOwner = await isCourseOwner(userId, id);
    if (!isOwner) {
      return { message: "Bạn không có quyền xem bài học này." };
    }
  }

  const result = await db.query(
    `SELECT * FROM lesson WHERE lesson_id=$1`,
    [id]
  );

  return formatLessonFile(result.rows[0]);
}

async function getLessonsByStudent(user_id) {
  const result = await db.query(
    `SELECT l.* FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     JOIN classmember cm ON c.course_id = cm.course_id
     JOIN registercourse rc ON cm.register_id = rc.register_id
     WHERE rc.user_id = $1`,
    [user_id]
  );
  return result.rows.map(row => formatLessonFile(row));
}

async function getLessonByIdForStudent(userId, lessonId) {
  const result = await db.query(
    `SELECT l.* FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     JOIN classmember cm ON cm.course_id = c.course_id
     JOIN registercourse rc ON rc.register_id = cm.register_id
     WHERE l.lesson_id = $1 AND rc.user_id = $2 AND rc.status = 'đã thanh toán'`,
    [lessonId, userId]
  );
  return formatLessonFile(result.rows[0]);
}

// Quyền PERMISSIONS
// Kiểm tra chủ sở hữu của bài học
async function isCourseOwner(userId, lessonId) {
  const result = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     WHERE l.lesson_id = $1 AND c.user_id = $2`,
    [lessonId, userId]
  );
  return result.rowCount > 0;
}

// Kiểm tra chủ sở hữu của khóa học
async function isCourseOwnerByCourse(userId, courseId) {
  const result = await db.query(
    `SELECT 1 FROM course WHERE course_id = $1 AND user_id = $2`,
    [courseId, userId]
  );
  return result.rowCount > 0;
}

// Kiểm tra user có quyền xem bài học
async function canUserViewLesson(userId, lessonId) {
  const result = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     LEFT JOIN classmember cm ON c.course_id = cm.course_id
     LEFT JOIN registercourse rc ON cm.register_id = rc.register_id
     WHERE l.lesson_id = $1
       AND (c.user_id = $2 OR (rc.user_id = $2 AND rc.status = 'đã thanh toán'))`,
    [lessonId, userId]
  );
  return result.rowCount > 0;
}

async function isCourseOwnerByLesson(userId, lessonId) {
  const result = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     WHERE l.lesson_id = $1 AND c.user_id = $2`,
    [lessonId, userId]
  );
  return result.rowCount > 0;
}

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
  getLessonsByStudent,
  getLessonByIdForStudent,
  isCourseOwner,
  isCourseOwnerByCourse,
  canUserViewLesson,
  isCourseOwnerByLesson
};
