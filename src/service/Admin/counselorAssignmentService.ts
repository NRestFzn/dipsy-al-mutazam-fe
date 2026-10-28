import { api } from "../api";
import type {
  CounselorAssignmentItem,
  CounselorAssignmentQuery,
  ReplaceCounselorAssignmentPayload,
} from "../../types/CounselorAssignment/counselorAssignmentTypes";

export const counselorAssignmentService = {
  getAssignments: async (
    params?: CounselorAssignmentQuery
  ): Promise<CounselorAssignmentItem[]> => {
    const response = await api.get<{
      statusCode: number;
      message: string;
      data: CounselorAssignmentItem[];
    }>("/v1/counselor-assignment", { params });
    return response.data.data;
  },

  replaceAssignments: async (
    payload: ReplaceCounselorAssignmentPayload
  ): Promise<CounselorAssignmentItem[]> => {
    const response = await api.put<{
      statusCode: number;
      message: string;
      data: CounselorAssignmentItem[];
    }>("/v1/counselor-assignment", payload);
    return response.data.data;
  },
};
