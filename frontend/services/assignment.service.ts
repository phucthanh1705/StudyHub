import * as AssignmentAPI from "../api/assignment.api";

export const AssignmentService = {
  // Lấy tất cả assignment của một lesson
  async getAssignmentsByLesson(lessonId: number) {
    try {
      console.log("[Service] Fetching assignments for lesson:", lessonId);
      const res = await AssignmentAPI.getAssignmentsByLesson(lessonId);
      console.log("[Service] Assignments fetched:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error fetching assignments:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể lấy danh sách bài tập.");
    }
  },

  // Lấy chi tiết assignment theo ID
  async getAssignmentById(id: number) {
    try {
      console.log("[Service] Fetching assignment ID:", id);
      const res = await AssignmentAPI.getAssignmentById(id);
      console.log("[Service] Assignment detail fetched:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error fetching assignment:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể lấy chi tiết bài tập.");
    }
  },

  // Thêm assignment
  async createAssignment(data: {
    lesson_id: number;
    title: string;
    description?: string;
    due_date_start: string;
    due_date_end: string;
    link_drive?: string;
  }) {
    try {
      console.log("[Service] Creating assignment with payload:", data);
      const res = await AssignmentAPI.createAssignment(data);
      console.log("[Service] Assignment created:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error creating assignment:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể tạo bài tập.");
    }
  },

  // Cập nhật assignment
  async updateAssignment(
    id: number,
    data: {
      title?: string;
      description?: string;
      due_date_start?: string;
      due_date_end?: string;
      link_drive?: string;
      status?: string;
    }
  ) {
    try {
      console.log("[Service] Updating assignment ID:", id, "with data:", data);
      const res = await AssignmentAPI.updateAssignment(id, data);
      console.log("[Service] Assignment updated:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error updating assignment:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể cập nhật bài tập.");
    }
  },

  // Xóa assignment
  async deleteAssignment(id: number) {
    try {
      console.log("[Service] Deleting assignment ID:", id);
      const res = await AssignmentAPI.deleteAssignment(id);
      console.log("[Service] Assignment deleted:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error deleting assignment:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể xóa bài tập.");
    }
  },
};
