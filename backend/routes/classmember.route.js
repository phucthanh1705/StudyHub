const express = require("express");
const router = express.Router();
const controller = require("../controllers/classmember.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Sinh viên (role = 2) – thao tác với giỏ môn học của mình
router.get("/", authMiddleware, checkRole(2), controller.getMyClassMembers);
router.get(
  "/filter",
  authMiddleware,
  checkRole(2),
  controller.getClassMembersByStatus
);
router.get(
  "/filter-strict",
  authMiddleware,
  checkRole(2),
  controller.getClassMembersByStatusStrict
); 
router.post(
  "/",
  authMiddleware,
  checkRole(2),
  controller.addCourseToClassMember
);
router.delete(
  "/",
  authMiddleware,
  checkRole(2),
  controller.removeCourseFromClassMember
);
router.post(
  "/save",
  authMiddleware,
  checkRole(2),
  controller.saveRegisterCourses
);
router.post("/pay", authMiddleware, checkRole(2), controller.payTuition);
router.get("/paid", authMiddleware, controller.getPaidClassMembers);

// Admin (role = 1) – xem toàn bộ giỏ môn học của tất cả sinh viên
router.get(
  "/admin/all",
  authMiddleware,
  checkRole(1),
  controller.getAllClassMembers
);

// API cho giảng viên xem danh sách sinh viên trong khóa học
router.get(
  "/teacher/:courseId/students",
  authMiddleware,
  checkRole(1, 3),
  controller.getStudentsByCourse
);

module.exports = router;
