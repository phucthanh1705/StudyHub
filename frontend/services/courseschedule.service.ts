import {
  getAllCourseSchedulesAdminApi,
  getCourseScheduleByIdAdminApi,
  updateCourseScheduleApi,
  deleteCourseScheduleApi,
  getCourseSchedulesByTeacherApi,
  getCourseSchedulesByStudentOneCourseApi,
  getSchedulesByStudentApi,
} from "../api/courseschedule.api";

export const CourseScheduleService = {
  // Admin
  getAllAdmin: async () => {
    try {
      const response = await getAllCourseSchedulesAdminApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getAllAdmin:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách lịch học (Admin) thất bại");
    }
  },

  getByIdAdmin: async (id: number) => {
    try {
      const response = await getCourseScheduleByIdAdminApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error getByIdAdmin:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy chi tiết lịch học (Admin) thất bại");
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await updateCourseScheduleApi(id, data);
      return response.data;
    } catch (error: any) {
      console.log("Error update:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Cập nhật lịch học thất bại");
    }
  },

  delete: async (id: number) => {
    try {
      const response = await deleteCourseScheduleApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error delete:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Xoá lịch học thất bại");
    }
  },

  // Giảng viên
  getByTeacher: async () => {
    try {
      const response = await getCourseSchedulesByTeacherApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getByTeacher:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy lịch dạy (Teacher) thất bại");
    }
  },

  // Sinh viên
  getByStudent: async (courseId?: number) => {
  try {
    const response = await getSchedulesByStudentApi(courseId);
    return response.data;
  } catch (error: any) {
    console.log("Error getByStudent:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Lấy lịch học (Student) thất bại");
  }
},

  getByStudentOneCourse: async (studentId: number, courseId: number) => {
    try {
      const response = await getCourseSchedulesByStudentOneCourseApi(studentId, courseId);
      return response.data;
    } catch (error: any) {
      console.log("Error getByStudentOneCourse:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy lịch học 1 môn của sinh viên thất bại");
    }
  },
};
