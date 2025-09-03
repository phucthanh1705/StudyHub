const db = require("../config/db");

// HÀM KIỂM TRA TRÙNG LỊCH GIẢNG VIÊN
async function checkLecturerScheduleConflict(user_id, date, start_time, end_time) {
  const query = `
    SELECT cs.schedule_id
    FROM courseschedule cs
    JOIN course c ON cs.course_id = c.course_id
    WHERE c.user_id = $1
      AND cs.date = $2
      AND ($3 < cs.end_time AND $4 > cs.start_time)
  `;
  const result = await db.query(query, [user_id, date, start_time, end_time]);
  return result.rows.length > 0;
}

// TẠO KHÓA HỌC + LỊCH HỌC
async function createCourse(course) {
  const { subject_id, user_id, semester, year, price, numofperiods, schedules } = course;

  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    throw new Error("Cần ít nhất một lịch học cho khóa học");
  }

  // 1. Kiểm tra trùng lịch cho từng buổi
  for (const sch of schedules) {
    const isConflict = await checkLecturerScheduleConflict(
      user_id, sch.date, sch.start_time, sch.end_time
    );
    if (isConflict) {
      throw new Error(`Giảng viên đã có lịch trùng vào ${sch.date} (${sch.start_time} - ${sch.end_time})`);
    }
  }

  // 2. Tạo khóa học
  const courseResult = await db.query(
    `INSERT INTO course (subject_id, user_id, semester, year, price, created_at, numofperiods)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6)
     RETURNING *`,
    [subject_id, user_id, semester, year, price, numofperiods]
  );
  const newCourse = courseResult.rows[0];

  // 3. Tạo nhiều lịch học
  for (const sch of schedules) {
    await db.query(
      `INSERT INTO courseschedule (course_id, date, start_time, end_time, room, note)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [newCourse.course_id, sch.date, sch.start_time, sch.end_time, sch.room, sch.note]
    );
  }

  return newCourse;
}

// LẤY TẤT CẢ KHÓA HỌC
async function getAllCourses() {
  const result = await db.query(
    `SELECT c.*, s.name AS subject_name
     FROM course c
     JOIN subject s ON c.subject_id = s.subject_id
     ORDER BY c.course_id DESC`
  );
  return result.rows;
}

// LẤY KHÓA HỌC THEO ID
async function getCourseById(courseId, userId = null, role = null) {
  let query = `
    SELECT c.*, s.name AS subject_name
    FROM course c
    JOIN subject s ON c.subject_id = s.subject_id
    WHERE c.course_id = $1
  `;
  const params = [Number(courseId)];

  if (Number(role) === 3) {
    query += ` AND c.user_id = $2`;
    params.push(Number(userId));
  }

  const courseResult = await db.query(query, params);
  const course = courseResult.rows[0];
  if (!course) return null;

  const schedulesResult = await db.query(
    `SELECT * FROM courseschedule WHERE course_id = $1 ORDER BY date, start_time`,
    [courseId]
  );
  course.schedules = schedulesResult.rows;

  return course;
}

// CẬP NHẬT KHÓA HỌC
async function updateCourse(courseId, data) {
  const { subject_id, user_id, semester, year, price, numofperiods } = data;

  const checkCourse = await db.query(
    `SELECT * FROM course WHERE course_id = $1`,
    [courseId]
  );
  if (checkCourse.rows.length === 0) {
    throw new Error(`Course ID ${courseId} không tồn tại`);
  }

  const result = await db.query(
    `UPDATE course SET
      subject_id = $1,
      user_id = $2,
      semester = $3,
      year = $4,
      price = $5,
      numofperiods = $6
     WHERE course_id = $7
     RETURNING *`,
    [subject_id, user_id, semester, year, price, numofperiods, courseId]
  );

  return result.rows[0];
}

// XÓA KHÓA HỌC
async function deleteCourse(courseId) {
  // Xóa tất cả lịch học liên quan
  await db.query(`DELETE FROM courseschedule WHERE course_id = $1`, [courseId]);

  // Sau đó xóa khóa học
  await db.query(`DELETE FROM course WHERE course_id = $1`, [courseId]);

  return { message: "Xóa thành công" };
}

// LẤY KHÓA HỌC THEO GIẢNG VIÊN
async function getCoursesByLecturer(userId) {
  const result = await db.query(
    `SELECT c.*, s.name AS subject_name
     FROM course c
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE c.user_id = $1
     ORDER BY c.course_id DESC`,
    [userId]
  );
  return result.rows;
}

// Trường hợp đã học
async function getCompletedCourses(userId) {
  const result = await db.query(`
    WITH LatestRegister AS (
        SELECT 
            MAX(end_register) AS latest_end_register,
            MAX(due_date_end) AS latest_due_date_end
        FROM registercourse
        WHERE user_id = $1
          AND status = 'đã thanh toán'
    )
    SELECT DISTINCT 
        c.course_id, 
        c.semester, 
        c.year, 
        c.price, 
        s.name AS subject_name
    FROM registercourse rc
    JOIN classmember cm 
      ON rc.register_id = cm.register_id
    JOIN course c 
      ON cm.course_id = c.course_id
    JOIN subject s 
      ON c.subject_id = s.subject_id
    JOIN LatestRegister lr ON TRUE
    WHERE rc.user_id = $1
      AND rc.status = 'đã thanh toán'
      AND rc.end_register < lr.latest_end_register
      AND rc.due_date_end < lr.latest_due_date_end
    ORDER BY c.course_id DESC
  `, [userId]);

  return result.rows;
}

// Trường hợp đang học
async function getCurrentCourses(userId) {
  const result = await db.query(`
    WITH LatestRegister AS (
        SELECT 
            MAX(end_register) AS latest_end_register,
            MAX(due_date_end) AS latest_due_date_end
        FROM registercourse
        WHERE user_id = $1
          AND status = 'đã thanh toán'
    )
    SELECT DISTINCT 
        c.course_id, 
        c.semester, 
        c.year, 
        c.price, 
        s.name AS subject_name
    FROM registercourse rc
    JOIN classmember cm 
      ON rc.register_id = cm.register_id
    JOIN course c 
      ON cm.course_id = c.course_id
    JOIN subject s 
      ON c.subject_id = s.subject_id
    JOIN LatestRegister lr ON TRUE
    WHERE rc.user_id = $1
      AND rc.status = 'đã thanh toán'
      AND rc.end_register = lr.latest_end_register
      AND rc.due_date_end = lr.latest_due_date_end
    ORDER BY c.course_id DESC
  `, [userId]);

  return result.rows;
}

// Trường hợp chưa học
async function getNotStartedCourses(userId, currentDate) {
  // 1. Lấy toàn bộ khóa học
  const allCoursesRes = await db.query(`
    SELECT DISTINCT 
        c.course_id, 
        c.semester, 
        c.year, 
        c.price, 
        s.name AS subject_name
    FROM course c
    JOIN subject s ON c.subject_id = s.subject_id
    ORDER BY c.course_id DESC
  `);
  const allCourses = allCoursesRes.rows;

  // 2. Lấy danh sách đã học
  const completedCourses = await getCompletedCourses(userId, currentDate);

  // 3. Lấy danh sách đang học
  const currentCourses = await getCurrentCourses(userId, currentDate);

  // 4. Trừ các khóa đã học + đang học
  const excludeIds = new Set([
    ...completedCourses.map(c => c.course_id),
    ...currentCourses.map(c => c.course_id)
  ]);

  const notStartedCourses = allCourses.filter(
    course => !excludeIds.has(course.course_id)
  );

  return notStartedCourses;
}


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByLecturer,
  getCompletedCourses,
  getCurrentCourses,
  getNotStartedCourses
};
