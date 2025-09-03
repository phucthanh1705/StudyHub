const express = require("express");
const router = express.Router();
const controller = require("../controllers/lesson.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/upload.middleware");

// Middleware auth bắt buộc cho tất cả
router.use(authMiddleware);

// Lấy tất cả bài học theo course (Admin + GV được phân công)
router.get("/", checkRole(1, 3), controller.getAllLessons);  
// Yêu cầu query ?course_id=<id> để lọc bài học theo course

// Sinh viên xem tất cả bài học đã đăng ký & thanh toán
router.get("/student", checkRole(2), controller.getLessonsByStudent);

// Xem bài học chi tiết theo ID (Admin/GV/Sinh viên)
router.get("/:id", controller.getLessonById);

// Thêm bài học (Admin hoặc GV được phân công) — có upload file
router.post("/", checkRole(1, 3), upload.single("file"), controller.createLesson);

// Cập nhật bài học (Admin hoặc GV được phân công)
router.put("/:id", checkRole(1, 3), upload.single("file"), controller.updateLesson);

// Xóa bài học (Admin hoặc GV được phân công)
router.delete("/:id", checkRole(1, 3), controller.deleteLesson);

module.exports = router;
