import { api } from "../api";

export const academicYearService = {
  getCurrent: async (): Promise<string> => {
    const response = await api.get<{ data: { academicYear: string } }>(
      "/v1/academic-year/current"
    );

    return response.data.data.academicYear;
  },
};
