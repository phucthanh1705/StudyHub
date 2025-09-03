const Course = require("../models/course.model");

// TẠO KHÓA HỌC MỚI (ADMIN)
exports.create = async (req, res) => {
  try {
    if (!req.body.schedules || !Array.isArray(req.body.schedules)) {
      return res.status(400).json({ error: "Thiếu hoặc sai định dạng 'schedules' (array)" });
    }

    const course = await Course.createCourse(req.body);
    res.status(201).json({
      message: "Tạo khóa học và lịch học thành công",
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LẤY TẤT CẢ KHÓA HỌC (ADMIN & SINH VIÊN)
exports.findAll = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LẤY KHÓA HỌC THEO ID
// (GIẢNG VIÊN CHỈ XEM NẾU MÌNH PHỤ TRÁCH)
exports.findById = async (req, res) => {
  const userId = Number(req.user?.id);
  const role = Number(req.user?.role);
  const courseId = Number(req.params.id);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "userId is invalid" });
  }

  try {
    const course = await Course.getCourseById(courseId, userId, role);

    if (course) res.json(course);
    else res.status(404).json({ error: "Không tìm thấy khóa học hoặc bạn không có quyền truy cập" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CẬP NHẬT KHÓA HỌC
exports.update = async (req, res) => {
  try {
    const updated = await Course.updateCourse(req.params.id, req.body);
    if (updated) {
      res.json({ message: "Cập nhật thành công", course: updated });
    } else {
      res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// XÓA KHÓA HỌC
exports.delete = async (req, res) => {
  try {
    const result = await Course.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GIẢNG VIÊN: LẤY KHÓA HỌC CỦA MÌNH
exports.getMyAssignedCourses = async (req, res) => {
  try {
    const courses = await Course.getCoursesByLecturer(req.user.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách khóa học theo đã, đang, chưa
exports.getCoursesForStudent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Không tìm thấy userId từ token" });
    }

    // Lấy dữ liệu từ model
    const completed = await Course.getCompletedCourses(userId);
    const current = await Course.getCurrentCourses(userId);
    const notStarted = await Course.getNotStartedCourses(userId);

    res.status(200).json({
      completed,
      current,
      notStarted
    });
  } catch (error) {
    console.error("Error getCoursesForStudent:", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy lên những môn chưa học để đăng ký ở giỏ hàng
exports.getAllCoursesForCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Không tìm thấy userId từ token" });
    }

    const notStarted = await Course.getNotStartedCourses(userId);

    res.status(200).json(notStarted);
  } catch (error) {
    console.error("Error getAllCoursesForCart:", error);
    res.status(500).json({ error: error.message });
  }
};


