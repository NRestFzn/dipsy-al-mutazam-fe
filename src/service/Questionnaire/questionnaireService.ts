import { api } from "../api";
import { mockDatabase } from "../mock/mockDatabase";
import type {
  GetPublicQuestionnaireParams,
  GetQuestionnaireParams,
  Questionnaire,
  QuestionnaireDetail,
  QuestionnaireHistoryParams,
  QuestionnaireHistoryResponse,
  QuestionnairePayload,
} from "../../types/Questionnaire/questionnaireTypes";
import type { ResponseData } from "../../types/commons";
import type { AnswerSubmission, SubmitAnswersRequest } from "../../types/Questionnaire/submissionTypes";

export type HistoryApiResponse = ResponseData<QuestionnaireHistoryResponse[]>;
export type QuestionnaireMeResponse = ResponseData<Questionnaire[]>;
export type SingleQuestionnaireResponse = ResponseData<Questionnaire>;

export type SubmissionResponse = ResponseData<any>;
export type SingleQuestionnaireDetailResponse = ResponseData<QuestionnaireDetail>;

const sortQuestions = (data: QuestionnaireDetail) => {
  if (data.questions && Array.isArray(data.questions)) {
    data.questions = [...data.questions].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  }
  return data;
};

export const questionnaireService = {
  getHistory: async (params: QuestionnaireHistoryParams): Promise<HistoryApiResponse> => {
    try {
      const response = await api.get<HistoryApiResponse>(
        "/v1/questionnaire-submission/history-me",
        { params }
      );
      return response.data;
    } catch {
      const rawUser = localStorage.getItem("userData");
      let currentStudentId = undefined;
      if (rawUser) {
        try {
          currentStudentId = JSON.parse(rawUser)?.id;
        } catch {
          // ignore
        }
      }
      const data = mockDatabase.getStudentHistory(currentStudentId, params.QuestionnaireID);
      return {
        statusCode: 200,
        message: "Sukses mengambil riwayat kuesioner",
        data,
      };
    }
  },

  getFamilyHistory: async (params: QuestionnaireHistoryParams): Promise<HistoryApiResponse> => {
    try {
      const response = await api.get<HistoryApiResponse>(
        "/v1/questionnaire-submission/history-submitted",
        { params }
      );
      return response.data;
    } catch {
      const data = mockDatabase.getStudentHistory(undefined, params.QuestionnaireID);
      return {
        statusCode: 200,
        message: "Sukses mengambil riwayat",
        data,
      };
    }
  },

  getPublicQuestionnaireById: async (id: string): Promise<QuestionnaireDetail> => {
    try {
      const response = await api.get<SingleQuestionnaireDetailResponse>(
        `/v1/questionnaire/${id}/public`
      );
      return sortQuestions(response.data.data!);
    } catch {
      return sortQuestions(mockDatabase.getQuestionnaireById(id));
    }
  },

  getQuestionnaireById: async (id: string): Promise<QuestionnaireDetail> => {
    try {
      const response = await api.get<SingleQuestionnaireDetailResponse>(
        `/v1/questionnaire/${id}`
      );
      return sortQuestions(response.data.data!);
    } catch {
      return sortQuestions(mockDatabase.getQuestionnaireById(id));
    }
  },

  getDetailWithFallback: async (id: string): Promise<QuestionnaireDetail> => {
    try {
      return await questionnaireService.getPublicQuestionnaireById(id);
    } catch (error) {
      console.log("Public API failed, retrying with protected endpoint...");
      return await questionnaireService.getQuestionnaireById(id);
    }
  },

  getQuestionnairesMe: async (): Promise<QuestionnaireMeResponse> => {
    try {
      const response = await api.get<QuestionnaireMeResponse>(
        "/v1/questionnaire/me"
      );
      return response.data;
    } catch {
      const list = mockDatabase.getQuestionnaires();
      return {
        statusCode: 200,
        message: "Sukses mengambil kuesioner",
        data: list,
      };
    }
  },

  getAllQuestionnaire: async (params: GetQuestionnaireParams): Promise<QuestionnaireMeResponse> => {
    try {
      const response = await api.get<QuestionnaireMeResponse>(
        "/v1/questionnaire",
        { params }
      );
      return response.data;
    } catch {
      const list = mockDatabase.getQuestionnaires();
      return {
        statusCode: 200,
        message: "Sukses mengambil kuesioner",
        data: list,
      };
    }
  },

  getPublicQuestionnaires: async (params: GetPublicQuestionnaireParams): Promise<QuestionnaireMeResponse> => {
    try {
      const response = await api.get<QuestionnaireMeResponse>(
        "/v1/questionnaire/public",
        { params }
      );
      return response.data;
    } catch {
      const list = mockDatabase.getQuestionnaires();
      return {
        statusCode: 200,
        message: "Sukses mengambil kuesioner",
        data: list,
      };
    }
  },

  createQuestionnaire: async (payload: QuestionnairePayload): Promise<SingleQuestionnaireResponse> => {
    const response = await api.post<SingleQuestionnaireResponse>(
      "/v1/questionnaire",
      payload
    );
    return response.data;
  },

  updateQuestionnaire: async (id: string, payload: QuestionnairePayload): Promise<SingleQuestionnaireResponse> => {
    const response = await api.put<SingleQuestionnaireResponse>(
      `/v1/questionnaire/${id}`,
      payload
    );
    return response.data;
  },

  deleteQuestionnaire: async (id: string): Promise<SingleQuestionnaireResponse> => {
    const response = await api.delete(`/v1/questionnaire/${id}`);
    return response.data;
  },

  submitAnswers: async (
    questionnaireId: string,
    answers: Record<string, string>,
    residentId?: string,
    activeRoleId?: string
  ): Promise<SubmissionResponse> => {
    try {
      const formattedAnswers: AnswerSubmission[] = Object.entries(answers).map(
        ([questionId, answerValue]) => {
          let convertedValue = answerValue;
          if (answerValue === "Ya") {
            convertedValue = "true";
          } else if (answerValue === "Tidak") {
            convertedValue = "false";
          }

          return {
            QuestionId: questionId,
            answerValue: convertedValue,
          };
        }
      );

      const requestData: SubmitAnswersRequest = {
        answers: formattedAnswers,
        ...(residentId && { UserId: residentId }),
      };

      const config: any = {};
      if (residentId && activeRoleId) {
        config.headers = {
          "x-active-role": activeRoleId,
        };
      }

      const response = await api.post<SubmissionResponse>(
        `/v1/questionnaire-submission/${questionnaireId}/submit`,
        requestData,
        config
      );

      return response.data;
    } catch {
      const mockResult = mockDatabase.submitAnswers(questionnaireId, answers, residentId);
      return mockResult;
    }
  },
};
