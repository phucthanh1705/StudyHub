// frontend/services/lesson.service.ts
import * as LessonAPI from "../api/lesson.api";

export const LessonService = {
  // Lấy tất cả bài học của một course
  async getAllLessons(courseId: number) {
    try {
      const res = await LessonAPI.getAllLessons(courseId);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Không thể lấy danh sách bài học.");
    }
  },

  // Lấy danh sách bài học của sinh viên đã thanh toán
  async getLessonsByStudent() {
    try {
      const res = await LessonAPI.getLessonsByStudent();
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Không thể lấy bài học cho sinh viên.");
    }
  },

  // Lấy chi tiết bài học
  async getLessonById(lessonId: number) {
    try {
      const res = await LessonAPI.getLessonById(lessonId);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Không thể lấy chi tiết bài học.");
    }
  },

  // Tạo bài học mới
  async createLesson(data: { title: string; content: string; course_id: number; file?: any }) {
  try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("course_id", data.course_id.toString());

      if (data.file) {
        formData.append("file", {
          uri: data.file.uri,
          name: data.file.name || "document.pdf",
          type: data.file.type || "application/pdf",
        } as any);
      }

      const res = await LessonAPI.createLesson(formData);
      return res.data;
    } catch (err: any) {
      console.error("Lỗi khi tạo bài học:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể tạo bài học.");
    }
  },


  // Cập nhật bài học
  async updateLesson(lessonId: number, data: { title: string; content: string; file?: any }) {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.file) formData.append("file", data.file);

      const res = await LessonAPI.updateLesson(lessonId, formData);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Không thể cập nhật bài học.");
    }
  },

  // Xoá bài học
  async deleteLesson(lessonId: number) {
    try {
      const res = await LessonAPI.deleteLesson(lessonId);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Không thể xoá bài học.");
    }
  },
};
