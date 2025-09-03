import api from "./axiosInstance";

const API_URL = "/api/courseschedules";

// Admin
// Lấy tất cả lịch học
export const getAllCourseSchedulesAdminApi = () => {
  return api.get(`${API_URL}`);
};

// Lấy chi tiết lịch học (Admin)
export const getCourseScheduleByIdAdminApi = (id: number) => {
  return api.get(`${API_URL}/${id}`);
};

// Sửa lịch học (Admin)
export const updateCourseScheduleApi = (id: number, data: any) => {
  return api.put(`${API_URL}/${id}`, data);
};

// Xoá lịch học (Admin)
export const deleteCourseScheduleApi = (id: number) => {
  return api.delete(`${API_URL}/${id}`);
};

// Giảng viên
// Lấy lịch dạy của giảng viên
export const getCourseSchedulesByTeacherApi = () => {
  return api.get(`${API_URL}/teacher/my-schedules`);
};

// Sinh viên
// Lấy lịch học cho sinh viên
export const getSchedulesByStudentApi = (courseId?: number) => {
  if (courseId) {
    return api.get(`/api/courseschedules/courseschedules/student?course_id=${courseId}`);
  }
  return api.get(`/api/courseschedules/courseschedules/student`);
};

// Lấy lịch học 1 môn cụ thể của sinh viên
export const getCourseSchedulesByStudentOneCourseApi = (studentId: number, courseId: number) => {
  return api.get(`${API_URL}/student/${studentId}/course/${courseId}`);
};
