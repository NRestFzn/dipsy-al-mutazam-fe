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
        try {
            const response = await api.get<GradeSummaryResponse>(
                `/v1/questionnaire-submission/summary-grade/${questionnaireId}`,
                {
                    params: {
                        gradeId: targetId,
                        GradeId: targetId,
                        RukunWargaId: targetId,
                        startDate,
                        endDate,
                    },
                }
            );
            return response.data;
        } catch {
            const response = await api.get<RWSummaryResponse>(
                `/v1/questionnaire-submission/summary-rw/${questionnaireId}`,
                {
                    params: {
                        RukunWargaId: targetId,
                        startDate,
                        endDate,
                    },
                }
            );
            return response.data;
        }
    },

    getSummaryClass: async (params: SummaryClassParams) => {
        const targetGradeId = params.gradeId || params.rwId;
        const targetClassId = params.classId || params.rtId;
        try {
            const response = await api.get<ClassSummaryResponse>(
                `/v1/questionnaire-submission/summary-class/${params.questionnaireId}`,
                {
                    params: {
                        ...params,
                        gradeId: targetGradeId,
                        classId: targetClassId,
                        GradeId: targetGradeId,
                        ClassId: targetClassId,
                        RukunWargaId: targetGradeId,
                        RukunTetanggaId: targetClassId,
                    },
                }
            );
            return response.data;
        } catch {
            const response = await api.get<RTSummaryResponse>(
                `/v1/questionnaire-submission/summary-rt/${params.questionnaireId}`,
                {
                    params: {
                        ...params,
                        RukunWargaId: targetGradeId,
                        RukunTetanggaId: targetClassId,
                    },
                }
            );
            return response.data;
        }
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
