const express = require("express");
const router = express.Router();
const controller = require("../controllers/assignment.controller");
const checkRole = require("../middlewares/checkRole");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware auth 
router.use(authMiddleware);

// Giảng viên hoặc sinh viên có quyền xem assignment nếu được phép qua model
router.get("/lesson/:lessonId", checkRole(1, 2, 3), controller.getAssignmentsByLesson);

router.get(
  "/assignment/:assignmentId",
  checkRole(1, 2, 3), // Thêm role 2
  controller.getSubmissionsByAssignment
);

// Xem assignment theo ID (admin/giảng viên/sinh viên)
router.get("/:id", checkRole(1, 2, 3), controller.getAssignmentById);

// Thêm assignment (chỉ admin hoặc giảng viên)
router.post("/", checkRole(1, 3), controller.createAssignment);

// Cập nhật assignment (chỉ admin hoặc giảng viên)
router.put("/:id", checkRole(1, 3), controller.updateAssignment);

// Xóa assignment (chỉ admin hoặc giảng viên)
router.delete("/:id", checkRole(1, 3), controller.deleteAssignment);

module.exports = router;
