import { api } from "../api";
import type {
  CreateTeacherPayload,
  GetTeachersParams,
  TeacherListResponse,
  UpdateTeacherPayload,
} from "../../types/Teacher/teacherTypes";

export const teacherService = {
  getTeachers: async (params?: GetTeachersParams): Promise<TeacherListResponse> => {
    const response = await api.get<TeacherListResponse>("/v1/user", { params });
    return response.data;
  },

  createTeacher: async (payload: CreateTeacherPayload) => {
    const response = await api.post("/v1/user", payload);
    return response.data;
  },

  updateTeacher: async (id: string, payload: UpdateTeacherPayload) => {
    const response = await api.put(`/v1/user/${id}`, payload);
    return response.data;
  },

  deleteTeacher: async (id: string) => {
    const response = await api.delete(`/v1/user/${id}`);
    return response.data;
  },
};
