const ClassMember = require("../models/classmember.model");

// Lấy danh sách tất cả môn học trong giỏ tạm
exports.getMyClassMembers = async (req, res) => {
  try {
    const result = await ClassMember.getClassMembersByUser(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm môn học vào giỏ
exports.addCourseToClassMember = async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) {
      return res.status(400).json({ message: "Thiếu course_id" });
    }

    const result = await ClassMember.addClassMember(req.user.id, course_id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Xoá môn học khỏi giỏ
exports.removeCourseFromClassMember = async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) {
      return res.status(400).json({ message: "Thiếu course_id" });
    }

    const result = await ClassMember.removeClassMember(req.user.id, course_id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Lọc danh sách môn học theo trạng thái
exports.getClassMembersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ message: "Thiếu trạng thái cần lọc" });
    }

    const result = await ClassMember.getClassMembersByStatus(
      req.user.id,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lọc danh sách môn học theo trạng thái (Strict)
exports.getClassMembersByStatusStrict = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ message: "Thiếu trạng thái cần lọc" });
    }

    const result = await ClassMember.getClassMembersByStatusStrict(
      req.user.id,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sinh viên nhấn "Lưu" giỏ tạm và cập nhật tổng học phí
exports.saveRegisterCourses = async (req, res) => {
  try {
    const result = await ClassMember.saveRegisterCourse(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sinh viên đóng học phí
exports.payTuition = async (req, res) => {
  try {
    const result = await ClassMember.payTuition(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Lấy toàn bộ giỏ môn học của mọi sinh viên
exports.getAllClassMembers = async (req, res) => {
  try {
    const result = await ClassMember.getAllClassMembers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaidClassMembers = async (req, res) => {
  try {
    const result = await ClassMember.getPaidClassMembers();
    res.status(200).json(result);
  } catch (err) {
    console.error("[Controller] Error getPaidClassMembers:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách đã thanh toán." });
  }
};

// Giảng viên xem danh sách sinh viên
exports.getStudentsByCourse = async (req, res) => {
  console.log("DEBUG user:", req.user);
  console.log("DEBUG params courseId:", req.params.courseId);

  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    const { allowed, data } = await ClassMember.getStudentsByCourse(
      teacherId,
      courseId
    );

    if (!allowed) {
      return res.status(403).json({
        message: "Bạn không có quyền xem danh sách khóa học này",
        data: [],
      });
    }

    return res.json({ message: "OK", data });
  } catch (error) {
    console.error("getStudentsByCourse error:", error);
    return res.status(500).json({ message: "Lỗi server", data: [] });
  }
};
