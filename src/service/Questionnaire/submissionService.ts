import { api } from "../api";
import type {
    ClassSummaryData,
    GradeSummaryData,
    RtSummaryData,
    RWSummaryData,
    SummaryClassParams,
    SummaryGradeParams,
    SummaryRtParams,
    SummaryRwParams
} from "../../types/Questionnaire/submissionTypes";
import type { ResponseData } from "../../types/commons";

export type RWSummaryResponse = ResponseData<RWSummaryData>;
export type RTSummaryResponse = ResponseData<RtSummaryData>;
export type GradeSummaryResponse = ResponseData<GradeSummaryData>;
export type ClassSummaryResponse = ResponseData<ClassSummaryData>;

export const submissionService = {
    getSummaryGrade: async ({ questionnaireId, gradeId, RukunWargaId, startDate, endDate }: SummaryGradeParams) => {
        const targetId = gradeId || RukunWargaId;
        const response = await api.get<GradeSummaryResponse>(
            `/v1/questionnaire-submission/summary-grade/${questionnaireId}`,
            {
                params: {
                    GradeId: targetId,
                    startDate,
                    endDate,
                },
            }
        );
        return response.data;
    },

    getSummaryClass: async (params: SummaryClassParams) => {
        const targetGradeId = params.gradeId || params.rwId;
        const targetClassId = params.classId || params.rtId;
        const response = await api.get<ClassSummaryResponse>(
            `/v1/questionnaire-submission/summary-class/${params.questionnaireId}`,
            {
                params: {
                    GradeId: targetGradeId,
                    ClassId: targetClassId,
                    startDate: params.startDate,
                    endDate: params.endDate,
                },
            }
        );
        return response.data;
    },

    getSummaryRw: async ({ questionnaireId, RukunWargaId, gradeId, startDate, endDate }: SummaryRwParams) => {
        return submissionService.getSummaryGrade({
            questionnaireId,
            gradeId: gradeId || RukunWargaId,
            RukunWargaId: RukunWargaId || gradeId,
            startDate,
            endDate,
        });
    },

    getSummaryRt: async (params: SummaryRtParams) => {
        return submissionService.getSummaryClass(params);
    },
};
