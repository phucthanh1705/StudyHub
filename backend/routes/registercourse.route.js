const express = require("express");
const router = express.Router();
const controller = require("../controllers/registercourse.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Admin (role = 1): tạo mới toàn bộ, xem tất cả, cập nhật thời gian hệ thống
router.post("/", authMiddleware, checkRole(1), controller.createRegisterCoursesForAll);
router.get("/", authMiddleware, checkRole(1), controller.getAllRegisterCourses);
router.put("/update-time", authMiddleware, checkRole(1), controller.updateRegisterTime);

// Sinh viên (role = 2): xem thông tin đăng ký của chính mình
router.get("/me", authMiddleware, checkRole(1,2), controller.getMyRegisterCourses);
// Lấy chi tiết đăng ký học phần theo id
router.get("/:id", authMiddleware, checkRole(1, 2), controller.getRegisterCourseDetail);


module.exports = router;
