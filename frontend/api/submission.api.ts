import axios from "axios";
import api from "./axiosInstance";

const API_URL = "/api/submission";

// Lấy tất cả submission của một assignment
export const getSubmissionsByAssignment = (assignmentId: number) => {
  console.log(`[API] GET ${API_URL}/assignment/${assignmentId}`);
  return api.get(`${API_URL}/assignment/${assignmentId}`);
};

// Lấy submission theo ID
export const getSubmissionById = (id: number) => {
  console.log(`[API] GET ${API_URL}/${id}`);
  return api.get(`${API_URL}/${id}`);
};

// Thêm submission
export const createSubmission = (data: {
  assignment_id: number;
  content?: string;
  drive_link?: string;
}) => {
  console.log("[API] POST", API_URL, data);
  return api.post(API_URL, data);
};

// Cập nhật submission
export const updateSubmission = (
  id: number,
  data: {
    content?: string;
    drive_link?: string;
  }
) => {
  console.log(`[API] PUT ${API_URL}/${id}`, data);
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa submission
export const deleteSubmission = (id: number) => {
  console.log(`[API] DELETE ${API_URL}/${id}`);
  return api.delete(`${API_URL}/${id}`);
};

// Chấm điểm submission
export const gradeSubmission = (
  id: number,
  data: {
    score?: number;
    feedback?: string;
  }
) => {
  console.log(`[API] PUT ${API_URL}/${id}/grade`, data);
  return api.put(`${API_URL}/${id}/grade`, data);
};

// Lấy tất cả bài nộp của chính user (sinh viên)
export const getSubmissionsByUser = () => {
  console.log(`[API] GET ${API_URL}/my`);
  return api.get(`${API_URL}/my`);
};
