import { RegisterCourseService } from "../../services/registercourse.service";
import { RegisterCourseAPI } from "../../api/registercourse.api";

jest.mock("../../api/registercourse.api", () => ({
  RegisterCourseAPI: {
    createForAll: jest.fn(),
    getAll: jest.fn(),
    updateRegisterTime: jest.fn(),
    getMyRegisterCourse: jest.fn(),
    getById: jest.fn(),
  },
}));

describe("Kiểm thử RegisterCourseService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== ADMIN ===============
  describe("createForAll", () => {
    it("Tạo đăng ký học phần cho toàn bộ user thành công", async () => {
      const data = {
        begin_register: "2025-07-01",
        end_register: "2025-07-31",
        year: 2025,
        semester: 1,
      };
      (RegisterCourseAPI.createForAll as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await RegisterCourseService.createForAll(data);
      expect(RegisterCourseAPI.createForAll).toHaveBeenCalledWith(data);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi createForAll thất bại", async () => {
      (RegisterCourseAPI.createForAll as jest.Mock).mockRejectedValueOnce(new Error("Không thể tạo đăng ký học phần."));
      await expect(
        RegisterCourseService.createForAll({
          begin_register: "2025-07-01",
          end_register: "2025-07-31",
          year: 2025,
          semester: 1,
        })
      ).rejects.toThrow("Không thể tạo đăng ký học phần.");
    });
  });

  describe("getAll", () => {
    it("Trả về danh sách tất cả đăng ký học phần", async () => {
      (RegisterCourseAPI.getAll as jest.Mock).mockResolvedValueOnce({ data: [{ register_id: 1 }] });
      const result = await RegisterCourseService.getAll();
      expect(RegisterCourseAPI.getAll).toHaveBeenCalled();
      expect(result).toEqual([{ register_id: 1 }]);
    });

    it("Báo lỗi khi getAll thất bại", async () => {
      (RegisterCourseAPI.getAll as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy danh sách đăng ký học phần."));
      await expect(RegisterCourseService.getAll()).rejects.toThrow("Không thể lấy danh sách đăng ký học phần.");
    });
  });

  describe("updateRegisterTime", () => {
    it("Cập nhật thời gian đăng ký thành công", async () => {
      const data = {
        begin: "2025-07-01",
        end: "2025-07-31",
        newBegin: "2025-08-01",
        newEnd: "2025-08-15",
      };
      (RegisterCourseAPI.updateRegisterTime as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await RegisterCourseService.updateRegisterTime(data);
      expect(RegisterCourseAPI.updateRegisterTime).toHaveBeenCalledWith(data);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi updateRegisterTime thất bại", async () => {
      (RegisterCourseAPI.updateRegisterTime as jest.Mock).mockRejectedValueOnce(new Error("Không thể cập nhật thời gian."));
      await expect(
        RegisterCourseService.updateRegisterTime({
          begin: "2025-07-01",
          end: "2025-07-31",
          newBegin: "2025-08-01",
          newEnd: "2025-08-15",
        })
      ).rejects.toThrow("Không thể cập nhật thời gian.");
    });
  });

  // =============== STUDENT ===============
  describe("getMyRegisterCourse", () => {
    it("Trả về thông tin đăng ký của sinh viên", async () => {
      (RegisterCourseAPI.getMyRegisterCourse as jest.Mock).mockResolvedValueOnce({
        data: { register_id: 2, status: "active" },
      });
      const result = await RegisterCourseService.getMyRegisterCourse();
      expect(RegisterCourseAPI.getMyRegisterCourse).toHaveBeenCalled();
      expect(result).toEqual({ register_id: 2, status: "active" });
    });

    it("Báo lỗi khi getMyRegisterCourse thất bại", async () => {
      (RegisterCourseAPI.getMyRegisterCourse as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy thông tin đăng ký."));
      await expect(RegisterCourseService.getMyRegisterCourse()).rejects.toThrow("Không thể lấy thông tin đăng ký.");
    });
  });
  describe("getById", () => {
  it("Lấy chi tiết đăng ký học phần theo ID thành công", async () => {
    const mockData = { register_id: 5, year: 2025, semester: 1 };
    (RegisterCourseAPI.getById as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await RegisterCourseService.getById(5);

    expect(RegisterCourseAPI.getById).toHaveBeenCalledWith(5);
    expect(result).toEqual(mockData);
  });

  it("Báo lỗi khi getById thất bại", async () => {
    (RegisterCourseAPI.getById as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy chi tiết đăng ký học phần."));

    await expect(RegisterCourseService.getById(999))
      .rejects
      .toThrow("Không thể lấy chi tiết đăng ký học phần.");
  });
});

});
