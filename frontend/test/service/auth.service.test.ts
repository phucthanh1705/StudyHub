import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../../services/auth.service";
import {
  registerAPI,
  sendOTPAPI,
  verifyOTPAPI,
  loginAPI,
  getMeAPI,
  logoutAPI,
} from "../../api/auth.api";

jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../api/auth.api", () => ({
  registerAPI: jest.fn(),
  sendOTPAPI: jest.fn(),
  verifyOTPAPI: jest.fn(),
  loginAPI: jest.fn(),
  getMeAPI: jest.fn(),
  logoutAPI: jest.fn(),
}));

describe("Kiểm thử AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("Trả về dữ liệu khi registerAPI thành công", async () => {
      (registerAPI as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await AuthService.register("John", "john@mail.com", "123456");
      expect(registerAPI).toHaveBeenCalledWith("John", "john@mail.com", "123456");
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi registerAPI thất bại", async () => {
      (registerAPI as jest.Mock).mockRejectedValueOnce(new Error("Lỗi đăng ký"));
      await expect(AuthService.register("John", "john@mail.com", "123456")).rejects.toThrow(
        "Lỗi đăng ký"
      );
    });
  });

  describe("sendOTP", () => {
    it("Trả về dữ liệu khi gửi OTP thành công", async () => {
      (sendOTPAPI as jest.Mock).mockResolvedValueOnce({ data: { otpSent: true } });
      const result = await AuthService.sendOTP("John", "john@mail.com", "123456");
      expect(sendOTPAPI).toHaveBeenCalledWith("John", "john@mail.com", "123456");
      expect(result).toEqual({ otpSent: true });
    });

    it("Báo lỗi khi gửi OTP thất bại", async () => {
      (sendOTPAPI as jest.Mock).mockRejectedValueOnce(new Error("Lỗi gửi OTP"));
      await expect(AuthService.sendOTP("John", "john@mail.com", "123456")).rejects.toThrow(
        "Lỗi gửi OTP"
      );
    });
  });

  describe("verifyOTP", () => {
    it("Trả về dữ liệu khi OTP hợp lệ", async () => {
      (verifyOTPAPI as jest.Mock).mockResolvedValueOnce({ data: { verified: true } });
      const result = await AuthService.verifyOTP("John", "john@mail.com", "123456", "9999");
      expect(verifyOTPAPI).toHaveBeenCalledWith("John", "john@mail.com", "123456", "9999");
      expect(result).toEqual({ verified: true });
    });

    it("Báo lỗi khi OTP không hợp lệ", async () => {
      (verifyOTPAPI as jest.Mock).mockRejectedValueOnce(new Error("OTP không hợp lệ"));
      await expect(
        AuthService.verifyOTP("John", "john@mail.com", "123456", "9999")
      ).rejects.toThrow("OTP không hợp lệ");
    });
  });

  describe("login", () => {
    it("Lưu token và role khi đăng nhập thành công", async () => {
      (loginAPI as jest.Mock).mockResolvedValueOnce({
        data: { token: "abc123", user: { role_id: 2 } },
      });
      await AuthService.login("john@mail.com", "123456");
      expect(loginAPI).toHaveBeenCalledWith("john@mail.com", "123456");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("token", "abc123");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("role_id", "2");
    });

    it("Trả về dữ liệu rỗng khi không có token", async () => {
      (loginAPI as jest.Mock).mockResolvedValueOnce({ data: {} });
      const result = await AuthService.login("john@mail.com", "123456");
      expect(result).toEqual({});
    });

    it("Báo lỗi khi loginAPI thất bại", async () => {
      (loginAPI as jest.Mock).mockRejectedValueOnce(new Error("Lỗi đăng nhập"));
      await expect(AuthService.login("john@mail.com", "123456")).rejects.toThrow("Lỗi đăng nhập");
    });
  });

  describe("getMe", () => {
    it("Trả về thông tin người dùng", async () => {
      (getMeAPI as jest.Mock).mockResolvedValueOnce({ data: { name: "John" } });
      const result = await AuthService.getMe();
      expect(getMeAPI).toHaveBeenCalled();
      expect(result).toEqual({ name: "John" });
    });

    it("Báo lỗi khi getMeAPI thất bại", async () => {
      (getMeAPI as jest.Mock).mockRejectedValueOnce(new Error("Không được phép"));
      await expect(AuthService.getMe()).rejects.toThrow("Không được phép");
    });
  });

  describe("logout", () => {
    it("Gọi logoutAPI và xóa token/role trong AsyncStorage", async () => {
      (logoutAPI as jest.Mock).mockResolvedValueOnce({});
      await AuthService.logout();
      expect(logoutAPI).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("token");
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("role_id");
    });

    it("Báo lỗi khi logoutAPI thất bại", async () => {
      (logoutAPI as jest.Mock).mockRejectedValueOnce(new Error("Lỗi đăng xuất"));
      await expect(AuthService.logout()).rejects.toThrow("Lỗi đăng xuất");
    });
  });

  describe("getRole", () => {
    it("Trả về role dưới dạng số", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("3");
      const role = await AuthService.getRole();
      expect(role).toBe(3);
    });

    it("Trả về null nếu không có role", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const role = await AuthService.getRole();
      expect(role).toBeNull();
    });
  });
});
