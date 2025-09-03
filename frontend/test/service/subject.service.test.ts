import { SubjectService } from "../../services/subject.service";
import {
  createSubjectApi,
  getAllSubjectsApi,
  getSubjectByIdApi,
  updateSubjectApi,
  deleteSubjectApi,
} from "../../api/subject.api";

jest.mock("../../api/subject.api");

describe("Kiểm thử SubjectService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSubject = {
    subject_id: 1,
    name: "Toán",
    description: "Môn Toán học cơ bản",
    created_at: "2025-07-24",
  };

  it("Tạo mới môn học thành công", async () => {
    (createSubjectApi as jest.Mock).mockResolvedValue({ data: mockSubject });

    const result = await SubjectService.create({
      name: "Toán",
      description: "Môn Toán học cơ bản",
    });

    expect(result).toEqual(mockSubject);
    expect(createSubjectApi).toHaveBeenCalledWith({
      name: "Toán",
      description: "Môn Toán học cơ bản",
    });
  });

  it("Báo lỗi khi tạo môn học thất bại", async () => {
    (createSubjectApi as jest.Mock).mockRejectedValue({
      response: { data: { error: "Tạo môn học thất bại" } },
    });

    await expect(
      SubjectService.create({ name: "Toán" })
    ).rejects.toThrow("Tạo môn học thất bại");
  });

  it("Trả về danh sách tất cả môn học", async () => {
    (getAllSubjectsApi as jest.Mock).mockResolvedValue({ data: [mockSubject] });

    const result = await SubjectService.getAll();
    expect(result).toEqual([mockSubject]);
    expect(getAllSubjectsApi).toHaveBeenCalledTimes(1);
  });

  it("Báo lỗi khi lấy danh sách môn học thất bại", async () => {
    (getAllSubjectsApi as jest.Mock).mockRejectedValue({
      response: { data: { error: "Lấy danh sách môn học thất bại" } },
    });

    await expect(SubjectService.getAll()).rejects.toThrow(
      "Lấy danh sách môn học thất bại"
    );
  });

  it("Trả về thông tin môn học theo ID", async () => {
    (getSubjectByIdApi as jest.Mock).mockResolvedValue({ data: mockSubject });

    const result = await SubjectService.getById(1);
    expect(result).toEqual(mockSubject);
    expect(getSubjectByIdApi).toHaveBeenCalledWith(1);
  });

  it("Báo lỗi khi lấy môn học theo ID thất bại", async () => {
    (getSubjectByIdApi as jest.Mock).mockRejectedValue({
      response: { data: { error: "Lấy thông tin môn học thất bại" } },
    });

    await expect(SubjectService.getById(99)).rejects.toThrow(
      "Lấy thông tin môn học thất bại"
    );
  });

  it("Cập nhật môn học thành công", async () => {
    (updateSubjectApi as jest.Mock).mockResolvedValue({
      data: { ...mockSubject, name: "Toán nâng cao" },
    });

    const result = await SubjectService.update(1, { name: "Toán nâng cao" });
    expect(result.name).toBe("Toán nâng cao");
    expect(updateSubjectApi).toHaveBeenCalledWith(1, { name: "Toán nâng cao" });
  });

  it("Báo lỗi khi cập nhật môn học thất bại", async () => {
    (updateSubjectApi as jest.Mock).mockRejectedValue({
      response: { data: { error: "Cập nhật môn học thất bại" } },
    });

    await expect(
      SubjectService.update(1, { name: "Toán nâng cao" })
    ).rejects.toThrow("Cập nhật môn học thất bại");
  });

  it("Xóa môn học thành công", async () => {
    (deleteSubjectApi as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await SubjectService.delete(1);
    expect(result.success).toBe(true);
    expect(deleteSubjectApi).toHaveBeenCalledWith(1);
  });

  it("Báo lỗi khi xóa môn học thất bại", async () => {
    (deleteSubjectApi as jest.Mock).mockRejectedValue({
      response: { data: { error: "Xóa môn học thất bại" } },
    });

    await expect(SubjectService.delete(1)).rejects.toThrow("Xóa môn học thất bại");
  });
});
