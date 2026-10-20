import type { ResponseData } from "../types/commons";
import type { GetResidentsParams, StudentMe, UpdateProfileStudentPayload } from "../types/Student/studentType";
import { api } from "./api";

export const studentService = {
  getAllStudents: async (params: GetResidentsParams) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );

    const response = await api.get("/v1/student", { params: cleanParams });
    return response.data;
  },

  getStudentProfile: async () => {
    const response = await api.get<ResponseData<StudentMe>>("/v1/student/me");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfileStudentPayload) => {
    const response = await api.put("/v1/student/me", payload);
    return response.data;
  },

  updateProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await api.put("/v1/user/update/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
