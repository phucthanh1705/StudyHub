const submissionModel = require("../models/submission.model");

// Thêm Submission
exports.createSubmission = async (req, res) => {
  try {
    if (req.user.role !== 2 && req.user.role !== 1)
      return res.status(403).json({ error: "Chỉ sinh viên hoặc admin được nộp bài." });

    // Kiểm tra link drive nếu có
    if (req.body.drive_link && !req.body.drive_link.startsWith("http")) {
      return res.status(400).json({ error: "drive_link không hợp lệ." });
    }

    const submission = await submissionModel.createSubmission(req.user.id, req.body);
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật Submission
exports.updateSubmission = async (req, res) => {
  try {
    if (req.user.role !== 2 && req.user.role !== 1)
      return res.status(403).json({ error: "Chỉ sinh viên hoặc admin được sửa bài." });

    if (req.body.drive_link && !req.body.drive_link.startsWith("http")) {
      return res.status(400).json({ error: "drive_link không hợp lệ." });
    }

    const updated = await submissionModel.updateSubmission(req.user.id, req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Cập nhật Submission
exports.updateSubmission = async (req, res) => {
  try {
    if (req.user.role !== 2 && req.user.role !== 1)
      return res.status(403).json({ error: "Chỉ sinh viên hoặc admin được sửa bài." });

    const updated = await submissionModel.updateSubmission(req.user.id, req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa Submission
exports.deleteSubmission = async (req, res) => {
  try {
    if (req.user.role !== 2 && req.user.role !== 1)
      return res.status(403).json({ error: "Chỉ sinh viên hoặc admin được xóa bài." });

    const result = await submissionModel.deleteSubmission(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả Submission của 1 Assignment
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    let submissions;

    if (role === 2) {
      // Sinh viên: chỉ xem bài nộp của chính họ
      submissions = await submissionModel.getSubmissionOfStudent(assignmentId, userId);
    } else {
      // Admin/Giảng viên: xem tất cả
      submissions = await submissionModel.getSubmissionsByAssignment(assignmentId);
    }

    res.json(submissions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Lấy Submission theo ID
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await submissionModel.getSubmissionById(
      req.user.id,
      req.user.role,
      req.params.id
    );
    if (!submission) return res.status(404).json({ error: "Không tìm thấy submission." });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Giảng viên/Admin chấm điểm & nhận xét
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    if (score === undefined && feedback === undefined) {
      return res.status(400).json({ error: "Cần nhập score hoặc feedback." });
    }

    const graded = await submissionModel.gradeSubmission(
      req.user.id,
      req.user.role,
      req.params.id,
      { score, feedback }
    );
    res.json(graded);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả Submission của 1 User (Sinh viên)
exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token
    const submissions = await submissionModel.getSubmissionsByUser(userId);

    if (!submissions || submissions.length === 0) {
      return res.status(200).json({ message: "Không có bài nộp nào." });
    }

    res.json(submissions);
  } catch (err) {
    console.error("[getMySubmissions] Error:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách bài nộp." });
  }
};

