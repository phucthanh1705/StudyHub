import * as SubmissionAPI from "../api/submission.api";

export const SubmissionService = {
  async getSubmissionsByAssignment(assignmentId: number) {
    try {
      const res = await SubmissionAPI.getSubmissionsByAssignment(assignmentId);
      return res.data;
    } catch (err: any) {
      console.error("Error fetching submissions:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể lấy danh sách bài nộp.");
    }
  },

  // Lấy submission theo ID
  async getSubmissionById(id: number) {
    try {
      console.log("[Service] Fetching submission ID:", id);
      const res = await SubmissionAPI.getSubmissionById(id);
      console.log("[Service] Submission detail:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error fetching submission:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể lấy chi tiết bài nộp.");
    }
  },

  // Thêm submission
  async createSubmission(data: {
    assignment_id: number;
    content?: string;
    drive_link?: string;
  }) {
    try {
      console.log("[Service] Creating submission with payload:", data);
      const res = await SubmissionAPI.createSubmission(data);
      console.log("[Service] Submission created:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error creating submission:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể nộp bài.");
    }
  },

  // Cập nhật submission
  async updateSubmission(
    id: number,
    data: {
      content?: string;
      drive_link?: string;
    }
  ) {
    try {
      console.log("[Service] Updating submission ID:", id, "with data:", data);
      const res = await SubmissionAPI.updateSubmission(id, data);
      console.log("[Service] Submission updated:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error updating submission:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể cập nhật bài nộp.");
    }
  },

  // Xóa submission
  async deleteSubmission(id: number) {
    try {
      console.log("[Service] Deleting submission ID:", id);
      const res = await SubmissionAPI.deleteSubmission(id);
      console.log("[Service] Submission deleted:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error deleting submission:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể xóa bài nộp.");
    }
  },

  // Chấm điểm submission
  async gradeSubmission(
    id: number,
    data: {
      score?: number;
      feedback?: string;
    }
  ) {
    try {
      console.log("[Service] Grading submission ID:", id, "with data:", data);
      const res = await SubmissionAPI.gradeSubmission(id, data);
      console.log("[Service] Submission graded:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[Service] Error grading submission:", err.response?.data || err);
      throw new Error(err.response?.data?.error || "Không thể chấm điểm bài nộp.");
    }
  },

  async getSubmissionsByUser() {
  try {
    console.log("[Service] Fetching submissions of current user...");
    const res = await SubmissionAPI.getSubmissionsByUser();

    if (res.data.message) {
      // Trường hợp không có bài nộp
      return [];
    }
    return res.data;
  } catch (err: any) {
    console.error("Error fetching submissions by user:", err.response?.data || err);
    throw new Error(err.response?.data?.error || "Không thể lấy danh sách bài nộp của sinh viên.");
  }
}
};
