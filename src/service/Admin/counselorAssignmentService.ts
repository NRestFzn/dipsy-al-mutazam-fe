import { api } from "../api";
import type { CounselorAssignmentMeGroup } from "../../types/CounselorAssignment/counselorAssignmentTypes";

export const counselorAssignmentService = {
  getMyAssignments: async (academicYear?: string): Promise<CounselorAssignmentMeGroup[]> => {
    const response = await api.get<{
      statusCode: number;
      message: string;
      data: CounselorAssignmentMeGroup[];
    }>("/v1/counselor-assignment/me", {
      params: academicYear ? { academicYear } : undefined,
    });
    return response.data.data;
  },
};
