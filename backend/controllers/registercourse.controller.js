const RegisterCourse = require('../models/registercourse.model');

// Admin: Tạo đăng ký học phần cho toàn bộ user
exports.createRegisterCoursesForAll = async (req, res) => {
  try {
    const { begin_register, end_register, year, semester } = req.body;

    if (!begin_register || !end_register || !year || !semester) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc." });
    }

    const result = await RegisterCourse.createAll(begin_register, end_register, year, semester);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sinh viên: Xem thông tin đăng ký học phần của chính mình
exports.getMyRegisterCourses = async (req, res) => {
  try {
    const data = await RegisterCourse.getRegisterCourseByUser(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Xem toàn bộ danh sách đăng ký học phần
exports.getAllRegisterCourses = async (req, res) => {
  try {
    const data = await RegisterCourse.getAllRegisterCourses();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Cập nhật thời gian đăng ký toàn hệ thống
exports.updateRegisterTime = async (req, res) => {
  try {
    console.log("=== DỮ LIỆU NHẬN TỪ FE ===");
    console.log(req.body);

    const { begin, end, newBegin, newEnd } = req.body;

    if (!begin || !end || !newBegin || !newEnd) {
      return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thời gian cũ và mới." });
    }

    const result = await RegisterCourse.updateRegisterTimeForAll(begin, end, newBegin, newEnd);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Lấy chi tiết đăng ký học phần theo id
exports.getRegisterCourseDetail = async (req, res) => {
  try {
    const registerId = parseInt(req.params.id);
    if (isNaN(registerId)) {
      return res.status(400).json({ error: "register_id không hợp lệ" });
    }

    const data = await RegisterCourse.getRegisterCourseById(
      registerId,
      req.user.id,
      req.user.role
    );

    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy bản ghi" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

