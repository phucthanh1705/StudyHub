const assignmentModel = require("../models/assignment.model");

// Lấy tất cả assignment của 1 lesson
exports.getAssignmentsByLesson = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const assignments = await assignmentModel.getAssignmentsByLesson(
      req.user.id,
      lessonId,
      req.user.role
    );
    res.json(assignments);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Lấy assignment theo ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await assignmentModel.getAssignmentById(
      req.user.id,
      req.params.id,
      req.user.role
    );
    if (!assignment)
      return res.status(404).json({ error: "Không tìm thấy assignment." });
    res.json(assignment);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Thêm assignment
exports.createAssignment = async (req, res) => {
  try {
    if (req.user.role !== 1 && req.user.role !== 3) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền thêm assignment." });
    }
    const newAssignment = await assignmentModel.createAssignment(
      req.user.id,
      req.body,
      req.user.role
    );
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Cập nhật assignment
exports.updateAssignment = async (req, res) => {
  try {
    if (req.user.role !== 1 && req.user.role !== 3) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền cập nhật assignment." });
    }
    const updated = await assignmentModel.updateAssignment(
      req.user.id,
      req.params.id,
      req.body,
      req.user.role
    );
    res.json(updated);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// Xóa assignment
exports.deleteAssignment = async (req, res) => {
  try {
    if (req.user.role !== 1 && req.user.role !== 3) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền xóa assignment." });
    }
    const result = await assignmentModel.deleteAssignment(
      req.user.id,
      req.params.id,
      req.user.role
    );
    res.json(result);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Nếu là sinh viên (role 2) thì chỉ trả về bài của chính họ
    if (req.user.role === 2) {
      const mySubmission = await submissionModel.getSubmissionByUser(
        assignmentId,
        req.user.id
      );
      return res.json(mySubmission ? [mySubmission] : []);
    }

    // Admin hoặc giảng viên xem toàn bộ
    const submissions = await submissionModel.getSubmissionsByAssignment(assignmentId);
    res.json(submissions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
