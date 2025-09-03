const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseschedule.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Middleware auth bắt buộc cho tất cả
router.use(authMiddleware);

// Admin (role_id = 1)
router.put("/:id", checkRole(1), controller.update);          // Sửa lịch học
router.delete("/:id", checkRole(1), controller.remove);       // Xoá lịch học
router.get("/", checkRole(1), controller.getAll);    // Xem tất cả lịch học
router.get("/:id", checkRole(1), controller.getById);   // Xem chi tiết lịch học

// Giảng viên (role_id = 3)
router.get("/teacher/my-schedules", checkRole(3), controller.getByTeacher);  // Lịch giảng dạy của mình

// Sinh viên(role_id = 2)
router.get("/courseschedules/student", checkRole(2), controller.getByStudent);     // Lịch học sinh viên có thể xem

// Sinh viên (2) xem lịch 1 môn đã thanh toán
router.get('/student/:studentId/course/:courseId', checkRole(2), controller.getByStudentOneCourse);


module.exports = router;
