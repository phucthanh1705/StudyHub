const express = require("express");
const router = express.Router();
const controller = require("../controllers/course.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Middleware auth bắt buộc cho tất cả
router.use(authMiddleware);

// Admin (role = 1)
router.post("/", checkRole(1), controller.create);                        // Tạo mới
router.put("/:id", checkRole(1), controller.update);                     // Cập nhật
router.delete("/:id", checkRole(1), controller.delete);                  // Xoá
router.get("/admin/all", checkRole(1), controller.findAll);             // Xem tất cả
router.get("/admin/:id", checkRole(1), controller.findById);            // Xem chi tiết

// Sinh viên (role = 2)
router.get("/student/all-courses", checkRole(2), controller.getAllCoursesForCart); // Lấy lên những môn chưa học để đăng ký ở giỏ hàng
router.get("/student/all", checkRole(2), controller.findAll);           // Xem tất cả
router.get("/student/courses", checkRole(2), controller.getCoursesForStudent);
router.get("/student/:id", checkRole(2), controller.findById);          // Xem chi tiết

// Giảng viên (role = 3) 
router.get("/teacher/my-courses", checkRole(3), controller.getMyAssignedCourses); // Xem các môn được phân công
router.get("/teacher/course/:id", checkRole(3), controller.findById);            // Xem chi tiết môn mình dạy


module.exports = router;
