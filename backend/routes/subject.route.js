const express = require('express');
const router = express.Router();
const controller = require('../controllers/subject.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole');

// Admin (role = 1): tạo, sửa, xóa, xem tất cả
router.post('/', authMiddleware, checkRole(1), controller.create);
router.get('/', authMiddleware, checkRole(1), controller.findAll);
router.put('/:id', authMiddleware, checkRole(1), controller.update);
router.delete('/:id', authMiddleware, checkRole(1), controller.delete);

// Admin (1) + Sinh viên (2) + Giảng viên (3): xem chi tiết môn học
router.get('/:id', authMiddleware, checkRole(1, 2, 3), controller.findById);

module.exports = router;
