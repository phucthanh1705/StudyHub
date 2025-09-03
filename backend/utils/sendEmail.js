const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"E-Learning" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã OTP xác nhận đăng ký",
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`
  });
}

module.exports = { sendOTP };
