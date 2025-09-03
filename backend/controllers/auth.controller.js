const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const authModel = require("../models/auth.model");
const otpModel = require("../models/otp.model");
const { sendOTP } = require("../utils/sendEmail");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Gửi OTP khi đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên, email và mật khẩu" });
    }

    const existing = await authModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.createOTP(email, otp, expiresAt);
    await sendOTP(email, otp);

    // Đợi xác thực OTP
    res.json({
      message: "OTP đã được gửi đến email. Vui lòng xác nhận OTP để hoàn tất đăng ký.",
      email,
      name,
      password
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng ký" });
  }
};

// Đăng nhập tài khoản
exports.login = async (req, res) => {
  try {
    console.log("====================================");
    console.log("[LOGIN] Yêu cầu đăng nhập nhận từ:", req.ip || "unknown IP");

    if (!req.body || typeof req.body !== "object") {
      console.log("[LOGIN] Không nhận được body từ request hoặc sai định dạng.");
      return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ." });
    }

    const { email, password } = req.body;
    console.log("[LOGIN] Dữ liệu nhận:", req.body);

    if (!email || !password) {
      console.log("[LOGIN] Thiếu email hoặc mật khẩu.");
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await authModel.findUserByEmail(email);
    if (!user) {
      console.log(`[LOGIN] Không tìm thấy người dùng với email: ${email}`);
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[LOGIN] Mật khẩu không đúng cho email: ${email}`);
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`[LOGIN] Đăng nhập thành công cho: ${email}`);

    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("[LOGIN ERROR]:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập" });
  } finally {
    console.log("[LOGIN] Kết thúc xử lý login\n");
  }
};

// Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy thông tin người dùng" });
  }
};

// Đăng xuất (Client cần xóa token)
exports.logout = async (req, res) => {
  try {
    // Với JWT stateless: chỉ thông báo
    res.json({ message: "Đăng xuất thành công. Hãy xóa token ở phía client." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng xuất" });
  }
};

// Gửi OTP qua email
exports.sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên, email và mật khẩu" });
    }

    const existing = await authModel.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.createOTP(email, otp, expiresAt);
    await sendOTP(email, otp);

    res.json({ message: "OTP đã được gửi đến email của bạn", email, name, password });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi gửi OTP" });
  }
};

// Xác thực OTP và tạo tài khoản
exports.verifyOTP = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const record = await otpModel.findOTP(email, otp);
    if (!record || new Date() > record.expires_at) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashed,
      role_id: 2,
    });

    await otpModel.deleteOTP(email);

    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xác thực OTP" });
  }
};