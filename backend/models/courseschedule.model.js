const db = require("../config/db");

// Hàm kiểm tra trùng lịch (CHO UPDATE)
async function checkLecturerScheduleConflictByCourse(course_id, date, start_time, end_time, exclude_schedule_id = null) {
  const userQuery = await db.query(
    `SELECT user_id FROM course WHERE course_id = $1`,
    [course_id]
  );
  if (userQuery.rows.length === 0) throw new Error("Course không tồn tại");
  const user_id = userQuery.rows[0].user_id;

  let query = `
    SELECT cs.schedule_id
    FROM courseschedule cs
    JOIN course c ON cs.course_id = c.course_id
    WHERE c.user_id = $1
      AND cs.date = $2
      AND ($3 < cs.end_time AND $4 > cs.start_time)
  `;
  const params = [user_id, date, start_time, end_time];

  if (exclude_schedule_id) {
    query += ` AND cs.schedule_id != $5`;
    params.push(exclude_schedule_id);
  }

  const result = await db.query(query, params);
  return result.rows.length > 0;
}

// Hàm cập nhật
async function update(schedule_id, data) {
  const { room, date, start_time, end_time, note, course_id } = data;

  const isConflict = await checkLecturerScheduleConflictByCourse(
    course_id,
    date,
    start_time,
    end_time,
    schedule_id
  );
  if (isConflict) throw new Error("Giảng viên đã có lịch trùng vào thời gian này");

  const result = await db.query(
    `UPDATE courseschedule
     SET room = $1, date = $2, start_time = $3, end_time = $4, note = $5
     WHERE schedule_id = $6 RETURNING *`,
    [room, date, start_time, end_time, note, schedule_id]
  );
  return result.rows[0];
}

// Hàm xóa
async function remove(schedule_id) {
  await db.query("DELETE FROM courseschedule WHERE schedule_id = $1", [schedule_id]);
  return { message: "Xoá lịch học thành công" };
}

// Lấy tất cả
async function getAll() {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name 
     FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     ORDER BY cs.date, cs.start_time`
  );
  return result.rows;
}

// Lấy theo ID
async function getById(schedule_id) {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name 
     FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE cs.schedule_id = $1`,
    [schedule_id]
  );
  return result.rows[0];
}

// Lấy bởi giảng viên
async function getByTeacher(userId) {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name
     FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE c.user_id = $1`,
    [userId]
  );
  return result.rows;
}

// Lấy bởi sinh viên
async function getByStudent(userId, course_id = null) {
  const regRes = await db.query(
    `SELECT * FROM registercourse WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (regRes.rows.length === 0) {
    return { success: false, message: "Bạn chưa từng đăng ký khóa học nào.", data: [] };
  }

  const reg = regRes.rows[0];
  const now = new Date();
  const begin = new Date(reg.begin_register);
  const end = new Date(reg.end_register);
  const due = new Date(reg.due_date_end);
  const status = reg.status;

  if (status === 'đã hủy môn') {
    return { success: false, message: "Bạn đã hủy môn học. Không thể xem lịch học.", data: [] };
  }

  if (status === 'đang chờ xử lý' && now >= begin && now <= end) {
    const result = course_id
      ? await db.query(
          `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
           JOIN course c ON cs.course_id = c.course_id
           JOIN subject s ON c.subject_id = s.subject_id
           WHERE cs.course_id = $1`,
          [course_id]
        )
      : await getAll();
    return { success: true, message: "Lấy lịch học theo điều kiện đăng ký còn hạn.", data: result.rows };
  }

  if (status === 'đã thanh toán') {
    const registeredCourses = await db.query(
      `SELECT course_id FROM classmember WHERE user_id = $1`,
      [userId]
    );
    const ids = registeredCourses.rows.map(r => r.course_id);
    if (ids.length === 0) {
      return { success: false, message: "Bạn chưa được xếp lớp cho khóa học nào.", data: [] };
    }

    const query = course_id ? `AND cs.course_id = $2` : "";
    const result = await db.query(
      `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
       JOIN course c ON cs.course_id = c.course_id
       JOIN subject s ON c.subject_id = s.subject_id
       WHERE cs.course_id = ANY($1) ${query}`,
      course_id ? [ids, course_id] : [ids]
    );
    return { success: true, message: "Lấy lịch học thành công (đã thanh toán).", data: result.rows };
  }

  if (status === 'đang chờ xử lý' && now > end && now <= due) {
    const registeredCourses = await db.query(
      `SELECT course_id FROM classmember WHERE user_id = $1`,
      [userId]
    );
    const ids = registeredCourses.rows.map(r => r.course_id);
    if (ids.length === 0) {
      return { success: false, message: "Bạn chưa được xếp lớp cho khóa học nào.", data: [] };
    }

    const query = course_id ? `AND cs.course_id = $2` : "";
    const result = await db.query(
      `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
       JOIN course c ON cs.course_id = c.course_id
       JOIN subject s ON c.subject_id = s.subject_id
       WHERE cs.course_id = ANY($1) ${query}`,
      course_id ? [ids, course_id] : [ids]
    );
    return { success: true, message: "Lấy lịch học thành công (đang chờ xử lý).", data: result.rows };
  }

  return { success: false, message: "Bạn không có quyền xem lịch học vào thời điểm này.", data: [] };
}

// Lấy danh sách sinh viên của khóa học
async function getByStudentOneCourse(userId, course_id) {
  return await getByStudent(userId, course_id);
}

module.exports = {
  update,
  remove,
  getAll,
  getById,
  getByTeacher,
  getByStudent,
  getByStudentOneCourse
};
