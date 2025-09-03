const db = require("../config/db");

// Hàm set giờ bắt đầu ngày
const setStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Hàm set giờ cuối ngày
const setEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Tạo mới lịch đăng ký
async function createAll(begin_register, end_register, year, semester) {
  const beginDate = setStartOfDay(begin_register);
  const endDate = setEndOfDay(end_register);

  // Tính thời gian đóng học phí
  const due_start = new Date(endDate);
  due_start.setDate(due_start.getDate() + 1);

  const due_end = new Date(due_start);
  due_end.setDate(due_start.getDate() + 20);

  // Lấy danh sách sinh viên
  const users = await db.query(`SELECT user_id FROM "users" WHERE role_id = 2`);

  // Check nếu kỳ học đã tồn tại cho bất kỳ user nào
  const checkAny = await db.query(
    `SELECT 1 FROM registercourse WHERE year = $1 AND semester = $2 LIMIT 1`,
    [year, String(semester)]
  );

  if (checkAny.rowCount > 0) {
    return { message: "Kỳ học này đã tồn tại, không thể tạo mới" };
  }

  // Thêm mới cho từng user
  for (const user of users.rows) {
    await db.query(
      `INSERT INTO registercourse 
        (user_id, create_at, begin_register, end_register, tuition, status, due_date_start, due_date_end, year, semester)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 0, 'đang chờ xử lý', $4, $5, $6, $7)`,
      [
        user.user_id,
        beginDate,
        endDate,
        due_start,
        due_end,
        year,
        String(semester),
      ]
    );
  }

  return { message: "Đã tạo thành công đăng ký học phần cho toàn bộ user." };
}

// Cập nhật lịch đăng ký
async function updateRegisterTimeForAll(begin, end, newBegin, newEnd) {
  // Ép tất cả về dạng yyyy-mm-dd để so sánh chuẩn
  const oldBeginDate = new Date(begin).toISOString().slice(0, 10);
  const oldEndDate = new Date(end).toISOString().slice(0, 10);

  const beginDate = setStartOfDay(newBegin);
  const endDate = setEndOfDay(newEnd);

  // Tính thời gian đóng học phí
  const due_start = new Date(endDate);
  due_start.setDate(due_start.getDate() + 1);

  const due_end = new Date(due_start);
  due_end.setDate(due_start.getDate() + 20);

  const result = await db.query(
    `UPDATE registercourse
     SET begin_register = $1, end_register = $2,
         due_date_start = $3, due_date_end = $4
     WHERE begin_register::date = $5::date
       AND end_register::date = $6::date`,
    [beginDate, endDate, due_start, due_end, oldBeginDate, oldEndDate]
  );

  console.log("Số bản ghi được cập nhật:", result.rowCount);
  return { message: "Cập nhật thời gian đăng ký cho toàn hệ thống thành công" };
}

// Lấy registercourse theo user
async function getRegisterCourseByUser(userId) {
  const res = await db.query(
    `SELECT r.*, u.name AS user_name, u.email
     FROM registercourse r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.user_id = $1
     ORDER BY r.create_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows;
}

// Lấy tất cả registercourse
async function getAllRegisterCourses() {
  const res = await db.query(`
    SELECT r.*, u.name AS user_name, u.email, u.role_id
    FROM registercourse r
    JOIN users u ON r.user_id = u.user_id
    WHERE u.role_id = 2
    ORDER BY r.create_at DESC
  `);
  return res.rows;
}

// Lấy registercourse theo ID
async function getRegisterCourseById(registerId, userId, role) {
  let query = `
    SELECT r.*, u.name AS user_name, u.email
    FROM registercourse r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.register_id = $1
  `;
  let params = [registerId];

  if (role === 2) {
    query += ` AND r.user_id = $2`;
    params.push(userId);
  }

  const registerRes = await db.query(query, params);
  if (registerRes.rows.length === 0) return null;

  const coursesRes = await db.query(
    `
    SELECT c.course_id, s.name AS subject_name, c.price
    FROM classmember cm
    JOIN course c ON cm.course_id = c.course_id
    JOIN subject s ON c.subject_id = s.subject_id
    WHERE cm.register_id = $1
  `,
    [registerId]
  );

  return {
    ...registerRes.rows[0],
    courses: coursesRes.rows,
  };
}

module.exports = {
  createAll,
  getRegisterCourseByUser,
  getAllRegisterCourses,
  updateRegisterTimeForAll,
  getRegisterCourseById,
};
