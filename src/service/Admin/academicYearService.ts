import { api } from "../api";
import type {
  AcademicYearItem,
  AcademicYearPayload,
} from "../../types/Academic/academicTypes";

export const academicYearService = {
  getAll: async (): Promise<AcademicYearItem[]> => {
    const response = await api.get<{ data: AcademicYearItem[] }>(
      "/v1/academic-year"
    );

    return response.data.data;
  },

  create: async (payload: AcademicYearPayload) => {
    const response = await api.post("/v1/academic-year", payload);

    return response.data;
  },

  update: async (id: string, payload: AcademicYearPayload) => {
    const response = await api.put(`/v1/academic-year/${id}`, payload);

    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.put(`/v1/academic-year/${id}/activate`);

    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/v1/academic-year/${id}`);

    return response.data;
  },

  getCurrent: async (): Promise<string> => {
    const response = await api.get<{ data: { academicYear: string } }>(
      "/v1/academic-year/current"
    );

    return response.data.data.academicYear;
  },
};
