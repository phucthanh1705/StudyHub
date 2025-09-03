// frontend/api/lesson.api.ts
import api from "./axiosInstance";

const BASE_URL = "/api/lesson";

//Lấy tất cả bài học theo course (Admin, Giảng viên)
export const getAllLessons = (courseId: number) =>
  api.get(`${BASE_URL}?course_id=${courseId}`);

//Lấy tất cả bài học của sinh viên đã thanh toán
export const getLessonsByStudent = () =>
  api.get(`${BASE_URL}/student`);

//Lấy bài học chi tiết theo ID
export const getLessonById = (lessonId: number) =>
  api.get(`${BASE_URL}/${lessonId}`);

// Tạo bài học 
export const createLesson = (data: FormData) =>
  api.post(BASE_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Cập nhật bài học
export const updateLesson = (lessonId: number, data: FormData) =>
  api.put(`${BASE_URL}/${lessonId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Xóa bài học
export const deleteLesson = (lessonId: number) =>
  api.delete(`${BASE_URL}/${lessonId}`);
