const express = require("express");
const router = express.Router();
const controller = require("../controllers/submission.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Middleware auth bắt buộc cho tất cả
router.use(authMiddleware);

// Lấy tất cả submission của 1 assignment (Admin/Giảng viên)
router.get("/assignment/:assignmentId", checkRole(1, 3), controller.getSubmissionsByAssignment);

// Sinh viên xem tất cả bài nộp của mình
router.get("/my", checkRole(2), controller.getMySubmissions);

// Lấy submission theo ID (Admin/Giảng viên/Sinh viên - kiểm tra quyền trong model)
router.get("/:id", checkRole(1, 2, 3), controller.getSubmissionById);

// Thêm submission (Admin/Sinh viên)
router.post("/", checkRole(1, 2), controller.createSubmission);

// Cập nhật submission (Admin/Sinh viên)
router.put("/:id", checkRole(1, 2), controller.updateSubmission);

// Xóa submission (Admin/Sinh viên)
router.delete("/:id", checkRole(1, 2), controller.deleteSubmission);

// Giảng viên/Admin chấm điểm và nhận xét
router.put("/:id/grade", checkRole(1, 3), controller.gradeSubmission);


module.exports = router;
