const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Admin (role_id = 1): toàn quyền với users
router.get("/", authMiddleware, checkRole(1), userController.getUsers);
// Lấy danh sách giảng viên (chỉ admin)
router.get("/teachers", authMiddleware, userController.getTeachers);
router.get("/:id", authMiddleware, userController.getUser);
router.post("/", authMiddleware, checkRole(1), userController.createUser);
router.put("/:id", authMiddleware, async (req, res, next) => {
  // Nếu là admin → cho qua controller
  if (req.user.role === 1) return userController.updateUser(req, res);

  // Nếu không phải admin → chỉ được sửa chính mình
  if (req.user.id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Bạn chỉ có thể sửa thông tin của chính mình" });
  }

  // Không cho phép sửa role_id nếu không phải admin
  if ("role_id" in req.body) {
    delete req.body.role_id;
  }

  return userController.updateUser(req, res);
});

router.delete("/:id", authMiddleware, checkRole(1), userController.deleteUser);
router.get("/:id/role", authMiddleware, checkRole(1,2,3), userController.getUserRole);

module.exports = router;
