const db = require("../config/db");

// Kiểm tra và cập nhật trạng thái nếu đã quá hạn đóng học phí
async function checkAndUpdateStatus(userId) {
  const result = await db.query(
    `SELECT register_id, status, due_date_end
     FROM registercourse
     WHERE user_id = $1
     ORDER BY create_at DESC
     LIMIT 1`,
    [userId]
  );

  if (result.rows.length === 0) return;

  const register = result.rows[0];
  const now = new Date();
  const dueDateEnd = new Date(register.due_date_end);

  if (register.status === "đang chờ xử lý" && now > dueDateEnd) {
    await db.query(
      `UPDATE registercourse SET status = 'đã hủy môn' WHERE register_id = $1`,
      [register.register_id]
    );
  }
}

// Kiểm tra có nằm trong khoảng thời gian đăng ký không
async function isWithinRegisterTime(userId) {
  const result = await db.query(
    `SELECT begin_register, end_register
     FROM registercourse
     WHERE user_id = $1
     ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (result.rows.length === 0) return false;

  const now = new Date();
  const { begin_register, end_register } = result.rows[0];
  return now >= new Date(begin_register) && now <= new Date(end_register);
}

async function addClassMember(userId, courseId) {
  await checkAndUpdateStatus(userId);

  const canRegister = await isWithinRegisterTime(userId);
  if (!canRegister) {
    return {
      message: "Hiện không nằm trong thời gian đăng ký môn học",
      data: null,
    };
  }

  const register = await db.query(
    `SELECT status FROM registercourse
     WHERE user_id = $1
     ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (!register.rows.length || register.rows[0].status !== "đang chờ xử lý") {
    return {
      message: "Không thể thêm môn học – trạng thái không hợp lệ",
      data: null,
    };
  }

  const exists = await db.query(
    `SELECT 1 FROM classmember WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  if (exists.rows.length > 0) {
    return { message: "Môn học đã có trong giỏ", data: null };
  }

  // Lấy lịch học của khóa học sắp thêm
  const newSchedule = await db.query(
    `SELECT date, start_time, end_time FROM courseschedule WHERE course_id = $1`,
    [courseId]
  );

  // Lấy lịch học của các môn đã có trong giỏ
  const existingSchedules = await db.query(
    `SELECT cs.date, cs.start_time, cs.end_time
     FROM classmember cm
     JOIN courseschedule cs ON cm.course_id = cs.course_id
     WHERE cm.user_id = $1`,
    [userId]
  );

  // So sánh trùng lịch
  for (let newSlot of newSchedule.rows) {
    const newDate = newSlot.date.toISOString().split("T")[0]; // so sánh theo ngày yyyy-mm-dd
    const newStart = newSlot.start_time;
    const newEnd = newSlot.end_time;

    for (let exist of existingSchedules.rows) {
      const existDate = exist.date.toISOString().split("T")[0];
      const existStart = exist.start_time;
      const existEnd = exist.end_time;

      // Nếu cùng ngày và giờ giao nhau → trùng lịch
      if (
        newDate === existDate &&
        ((newStart >= existStart && newStart < existEnd) ||
          (newEnd > existStart && newEnd <= existEnd) ||
          (newStart <= existStart && newEnd >= existEnd))
      ) {
        return {
          message: "Khóa học bị trùng lịch với môn học đã chọn trước đó.",
          data: null,
        };
      }
    }
  }

  // Nếu không trùng, thêm vào giỏ
  const course = await db.query(
    `SELECT price FROM course WHERE course_id = $1`,
    [courseId]
  );
  const price = course.rows[0]?.price;

  const getRegisterId = await db.query(
    `SELECT register_id FROM registercourse
   WHERE user_id = $1
   ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );
  const register_id = getRegisterId.rows[0].register_id;

  await db.query(
    `INSERT INTO classmember (user_id, register_id, course_id, joined_at, price)
      VALUES ($1, $2, $3, NOW(), $4)`,
    [userId, register_id, courseId, price]
  );
  return { message: "Đã thêm môn học vào giỏ", data: { course_id: courseId } };
}

async function removeClassMember(userId, courseId) {
  await checkAndUpdateStatus(userId);

  const canRegister = await isWithinRegisterTime(userId);
  if (!canRegister) {
    return {
      message: "Hiện không nằm trong thời gian đăng ký môn học",
      data: null,
    };
  }

  const register = await db.query(
    `SELECT status FROM registercourse
     WHERE user_id = $1
     ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (!register.rows.length || register.rows[0].status !== "đang chờ xử lý") {
    return {
      message: "Không thể xoá môn học – trạng thái không hợp lệ",
      data: null,
    };
  }

  await db.query(
    `DELETE FROM classmember WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );

  return { message: "Đã xoá môn học khỏi giỏ", data: { course_id: courseId } };
}

// Lấy danh sách môn học trong giỏ
async function getClassMembersByUser(userId) {
  await checkAndUpdateStatus(userId);

  const register = await db.query(
    `SELECT status, due_date_end
     FROM registercourse
     WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (register.rows.length === 0) {
    return {
      message: "Chưa có đợt đăng ký nào.",
      data: [],
    };
  }

  const { status, due_date_end } = register.rows[0];

  const result = await db.query(
    `SELECT
        c.course_id,
        s.name AS subject_name,
        c.price,
        $1 AS status,
        $2::timestamp AS due_date_end
     FROM classmember cm
     JOIN course c ON cm.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE cm.user_id = $3`,
    [status, due_date_end, userId]
  );

  if (result.rows.length === 0) {
    return {
      message: "Chưa có môn học nào trong giỏ.",
      data: [],
    };
  }

  return {
    message: "Lấy danh sách môn học thành công.",
    data: result.rows,
  };
}

// Save giỏ tạm → đóng học phí
async function saveRegisterCourse(userId) {
  await checkAndUpdateStatus(userId);

  const registerRes = await db.query(
    `SELECT register_id, status, end_register
     FROM registercourse
     WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (registerRes.rows.length === 0) {
    return {
      message: "Không tìm thấy bản đăng ký.",
      data: null,
    };
  }

  const { register_id, status, end_register } = registerRes.rows[0];

  if (status !== "đang chờ xử lý") {
    return {
      message: "Không thể lưu giỏ – trạng thái không hợp lệ.",
      data: null,
    };
  }

  if (new Date() > new Date(end_register)) {
    return {
      message: "Đã hết hạn đăng ký, không thể lưu giỏ.",
      data: null,
    };
  }

  const classRes = await db.query(
    `SELECT SUM(price) as total FROM classmember WHERE user_id = $1`,
    [userId]
  );
  const total = parseFloat(classRes.rows[0]?.total || 0);

  await db.query(
    `UPDATE registercourse SET tuition = $1 WHERE register_id = $2`,
    [total, register_id]
  );

  return {
    message: "Lưu giỏ môn học thành công.",
    data: {
      register_id,
      total,
    },
  };
}

// Đóng học phí – chỉ thực hiện được 1 lần nếu trong khoảng thời gian đóng học phí
async function payTuition(userId) {
  await checkAndUpdateStatus(userId);

  const res = await db.query(
    `SELECT register_id, status, tuition, due_date_start, due_date_end
     FROM registercourse
     WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (res.rows.length === 0) {
    return {
      message: "Không tìm thấy bản đăng ký.",
      data: null,
    };
  }

  const { register_id, status, tuition, due_date_start, due_date_end } =
    res.rows[0];
  const now = new Date();

  if (status !== "đang chờ xử lý") {
    return {
      message: "Không thể đóng học phí – trạng thái không hợp lệ.",
      data: null,
    };
  }

  if (now < new Date(due_date_start) || now > new Date(due_date_end)) {
    return {
      message: "Không nằm trong thời gian đóng học phí.",
      data: null,
    };
  }

  if (tuition === 0) {
    return {
      message: "Chưa có môn học nào để đóng học phí.",
      data: null,
    };
  }

  await db.query(
    `UPDATE registercourse SET status = 'đã thanh toán' WHERE register_id = $1`,
    [register_id]
  );

  return {
    message: "Đóng học phí thành công.",
    data: {
      register_id,
      amount: tuition,
    },
  };
}

async function getClassMembersByStatus(userId, filterStatus) {
  await checkAndUpdateStatus(userId);

  const register = await db.query(
    `SELECT status, due_date_end
     FROM registercourse
     WHERE user_id = $1 AND status = $2
     ORDER BY create_at DESC LIMIT 1`,
    [userId, filterStatus]
  );

  if (register.rows.length === 0) {
    return {
      message: "Chưa có đợt đăng ký nào với trạng thái này.",
      data: [],
    };
  }

  const { status, due_date_end } = register.rows[0];

  const result = await db.query(
    `SELECT
        c.course_id,
        s.name AS subject_name,
        c.price,
        $1 AS status,
        $2::timestamp AS due_date_end
     FROM classmember cm
     JOIN course c ON cm.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE cm.user_id = $3`,
    [status, due_date_end, userId]
  );

  if (result.rows.length === 0) {
    return {
      message: "Không có môn học nào trong trạng thái đã lọc.",
      data: [],
    };
  }

  return {
    message: "Lọc môn học thành công.",
    data: result.rows,
  };
}
// Lọc danh sách môn học theo trạng thái nhưng lọc chính xác theo register_id
async function getClassMembersByStatusStrict(userId, filterStatus) {
  await checkAndUpdateStatus(userId);

  // Lấy bản đăng ký mới nhất của user
  const register = await db.query(
    `SELECT register_id, status, due_date_end
     FROM registercourse
     WHERE user_id = $1
     ORDER BY create_at DESC
     LIMIT 1`,
    [userId]
  );

  if (register.rows.length === 0) {
    return {
      message: "Chưa có đợt đăng ký nào.",
      data: [],
    };
  }

  const { register_id, status, due_date_end } = register.rows[0];

  // Nếu có filterStatus và trạng thái hiện tại không khớp
  if (filterStatus && filterStatus.toLowerCase() !== status.toLowerCase()) {
    return {
      message: `Trạng thái hiện tại là "${status}", không khớp với "${filterStatus}".`,
      data: [],
      currentStatus: status,
    };
  }

  // Lấy danh sách môn học thuộc đúng register_id
  const result = await db.query(
    `SELECT
        c.course_id,
        s.name AS subject_name,
        c.price,
        $1 AS status,
        $2::timestamp AS due_date_end
     FROM classmember cm
     JOIN course c ON cm.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE cm.user_id = $3
       AND cm.register_id = $4`,
    [status, due_date_end, userId, register_id]
  );

  if (result.rows.length === 0) {
    return {
      message: "Không có môn học nào trong trạng thái đã lọc.",
      data: [],
      currentStatus: status,
    };
  }

  return {
    message: "Lọc môn học thành công.",
    data: result.rows,
    currentStatus: status,
  };
}

// Admin: lấy toàn bộ giỏ tạm
async function getAllClassMembers() {
  const result = await db.query(
    `SELECT
       u.user_id,
       u.name, -- đảm bảo đây là cột đúng trong bảng users
       c.course_id,
       s.name AS subject_name,
       c.price,
       rc.status,
       rc.due_date_end
     FROM classmember cm
     JOIN users u ON cm.user_id = u.user_id
     JOIN course c ON cm.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     JOIN registercourse rc ON cm.user_id = rc.user_id
     WHERE rc.status IN ('đang chờ xử lý', 'đã thanh toán', 'đã hủy môn')
     ORDER BY u.user_id, cm.joined_at DESC`
  );

  if (result.rows.length === 0) {
    return {
      message: "Hiện chưa có sinh viên nào đăng ký môn học.",
      data: [],
    };
  }

  return {
    message: "Lấy danh sách giỏ môn học thành công.",
    data: result.rows,
  };
}

// Admin: lấy toàn bộ danh sách classmember đã thanh toán
async function getPaidClassMembers() {
  const result = await db.query(
    `SELECT
       u.user_id,
       u.name AS user_name,
       c.course_id,
       s.name AS subject_name,
       c.price,
       rc.status,
       rc.due_date_end
     FROM classmember cm
     JOIN users u ON cm.user_id = u.user_id
     JOIN course c ON cm.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     JOIN registercourse rc ON cm.user_id = rc.user_id
     WHERE rc.status = 'đã thanh toán'
     ORDER BY u.user_id, cm.joined_at DESC`
  );

  if (result.rows.length === 0) {
    return {
      message: "Hiện chưa có sinh viên nào đã thanh toán.",
      data: [],
    };
  }

  return {
    message: "Lấy danh sách đã thanh toán thành công.",
    data: result.rows,
  };
}

// Lấy danh sách sinh viên của một khóa học, kiểm tra quyền giảng viên
async function getStudentsByCourse(teacherId, courseId) {
  console.log("DEBUG teacherId:", teacherId, "courseId:", courseId);
  const check = await db.query(
    `SELECT course_id, user_id FROM course WHERE course_id = $1`,
    [courseId]
  );

  if (!check.rows.length || check.rows[0].user_id !== teacherId) {
    return { allowed: false, data: [] };
  }

  const students = await db.query(
    `SELECT u.user_id, u.name, u.email
     FROM classmember cm
     JOIN users u ON cm.user_id = u.user_id
     WHERE cm.course_id = $1`,
    [courseId]
  );
  return { allowed: true, data: students.rows };
}

module.exports = {
  addClassMember,
  removeClassMember,
  getClassMembersByUser,
  getClassMembersByStatus,
  getClassMembersByStatusStrict,
  saveRegisterCourse,
  payTuition,
  getAllClassMembers,
  getPaidClassMembers,
  getStudentsByCourse,
};
