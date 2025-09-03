import { UserService } from "../../services/user.service";
import {
  getAllUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getAllTeachersApi,
} from "../../api/user.api";

jest.mock("../../api/user.api", () => ({
  getAllUsersApi: jest.fn(),
  getUserByIdApi: jest.fn(),
  createUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  deleteUserApi: jest.fn(),
  getAllTeachersApi: jest.fn(),
}));

describe("Kiểm thử UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("Trả về danh sách người dùng khi API thành công", async () => {
      (getAllUsersApi as jest.Mock).mockResolvedValueOnce({ data: [{ user_id: 1, name: "A" }] });
      const result = await UserService.getAll();
      expect(getAllUsersApi).toHaveBeenCalled();
      expect(result).toEqual([{ user_id: 1, name: "A" }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getAllUsersApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách người dùng thất bại"));
      await expect(UserService.getAll()).rejects.toThrow("Lấy danh sách người dùng thất bại");
    });
  });

  describe("getById", () => {
    it("Trả về thông tin người dùng khi API thành công", async () => {
      (getUserByIdApi as jest.Mock).mockResolvedValueOnce({ data: { user_id: 1, name: "A" } });
      const result = await UserService.getById(1);
      expect(getUserByIdApi).toHaveBeenCalledWith(1);
      expect(result).toEqual({ user_id: 1, name: "A" });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getUserByIdApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy thông tin người dùng thất bại"));
      await expect(UserService.getById(1)).rejects.toThrow("Lấy thông tin người dùng thất bại");
    });
  });

  describe("create", () => {
    it("Trả về dữ liệu người dùng mới khi tạo thành công", async () => {
      const newUser = { name: "B", email: "b@mail.com" };
      (createUserApi as jest.Mock).mockResolvedValueOnce({ data: { user_id: 2, ...newUser } });
      const result = await UserService.create(newUser);
      expect(createUserApi).toHaveBeenCalledWith(newUser);
      expect(result).toEqual({ user_id: 2, ...newUser });
    });

    it("Báo lỗi khi tạo người dùng thất bại", async () => {
      (createUserApi as jest.Mock).mockRejectedValueOnce(new Error("Tạo người dùng thất bại"));
      await expect(UserService.create({ name: "B" })).rejects.toThrow("Tạo người dùng thất bại");
    });
  });

  describe("update", () => {
    it("Trả về dữ liệu người dùng đã cập nhật khi thành công", async () => {
      const updatedData = { name: "C" };
      (updateUserApi as jest.Mock).mockResolvedValueOnce({ data: { user_id: 1, ...updatedData } });
      const result = await UserService.update(1, updatedData);
      expect(updateUserApi).toHaveBeenCalledWith(1, updatedData);
      expect(result).toEqual({ user_id: 1, ...updatedData });
    });

    it("Báo lỗi khi cập nhật thất bại", async () => {
      (updateUserApi as jest.Mock).mockRejectedValueOnce(new Error("Cập nhật người dùng thất bại"));
      await expect(UserService.update(1, { name: "C" })).rejects.toThrow("Cập nhật người dùng thất bại");
    });
  });

  describe("delete", () => {
    it("Trả về dữ liệu sau khi xóa thành công", async () => {
      (deleteUserApi as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await UserService.delete(1);
      expect(deleteUserApi).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi xóa thất bại", async () => {
      (deleteUserApi as jest.Mock).mockRejectedValueOnce(new Error("Xóa người dùng thất bại"));
      await expect(UserService.delete(1)).rejects.toThrow("Xóa người dùng thất bại");
    });
  });

  describe("getAllTeachers", () => {
    it("Trả về danh sách giảng viên khi API thành công", async () => {
      (getAllTeachersApi as jest.Mock).mockResolvedValueOnce({ data: { data: [{ id: 1, name: "GV A" }] } });
      const result = await UserService.getAllTeachers();
      expect(getAllTeachersApi).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, name: "GV A" }]);
    });

    it("Báo lỗi khi lấy danh sách giảng viên thất bại", async () => {
      (getAllTeachersApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách giảng viên thất bại"));
      await expect(UserService.getAllTeachers()).rejects.toThrow("Lấy danh sách giảng viên thất bại");
    });
  });
});
