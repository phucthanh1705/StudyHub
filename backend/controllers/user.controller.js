const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

// Regex kiểm tra mật khẩu mạnh
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(password);
};

// Lấy tất cả người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// Lấy người dùng theo ID
exports.getUser = async (req, res) => {
  try {
    const requestedId = Number(req.params.id); // id được truyền vào
    const requesterId = req.user.id; // id của người gửi request
    const requesterRole = req.user.role; // role của người gửi request

    // Nếu không phải admin (1) và đang cố xem thông tin người khác → chặn
    if (requesterRole !== 1 && requestedId !== requesterId) {
      return res.status(403).json({ message: "Không có quyền xem thông tin người khác" });
    }

    const user = await userModel.getUserById(requestedId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy người dùng" });
  }
};

// Tạo người dùng mới (admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      name,
      email,
      password: hashed,
      role_id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Lỗi khi tạo người dùng" });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt",
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Chỉ admin mới được thay đổi role_id
    if (req.user.role === 1 && role_id !== undefined) {
      updateData.role_id = role_id;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu nào để cập nhật" });
    }

    const updated = await userModel.updateUser(req.params.id, updateData);
    res.json({ message: "Cập nhật thành công", user: updated });

  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error: error.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    console.log("Deleting user with ID:", req.params.id);
    const deleted = await userModel.deleteUser(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy user hoặc không thể xóa" });
    }
    res.json({ message: "Xóa người dùng thành công", user: deleted });
  } catch (error) {
    console.error("Error deleteUser:", error.message);
    res.status(500).json({ error: error.message || "Xóa người dùng thất bạt" });
  }
};

// Lấy danh sách giảng viên (chỉ admin mới xem)
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await userModel.getAllTeachers();
    res.status(200).json({
      success: true,
      message: "Danh sách giảng viên",
      data: teachers,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giảng viên:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await userModel.getUserRoleById(id);

    if (!role) {
      return res.status(404).json({ error: "Role không tồn tại" });
    }

    res.json(role);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error);
    res.status(500).json({ error: "Lấy role người dùng thất bại" });
  }
};
