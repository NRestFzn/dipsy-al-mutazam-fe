import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
    submissionService,
    type ClassSummaryResponse,
    type GradeSummaryResponse,
    type RTSummaryResponse,
    type RWSummaryResponse
} from "../../service/Questionnaire/submissionService";
import type {
    SummaryClassParams,
    SummaryGradeParams,
    SummaryRtParams,
    SummaryRwParams
} from "../../types/Questionnaire/submissionTypes";

export const useSummaryGrade = (params: SummaryGradeParams) => {
    const targetGradeId = params.gradeId || params.RukunWargaId;
    return useQuery<GradeSummaryResponse, Error>({
        queryKey: ["summary-grade", params.questionnaireId, targetGradeId, params.startDate, params.endDate],
        queryFn: () => submissionService.getSummaryGrade(params),
        placeholderData: keepPreviousData,
        enabled: !!params.questionnaireId && !!targetGradeId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSummaryClass = (params: SummaryClassParams) => {
    const targetGradeId = params.gradeId || params.rwId;
    const targetClassId = params.classId || params.rtId;
    return useQuery<ClassSummaryResponse, Error>({
        queryKey: ['summary-class', params.questionnaireId, targetGradeId, targetClassId, params.startDate, params.endDate, params.academicYear],
        queryFn: () => submissionService.getSummaryClass(params),
        placeholderData: keepPreviousData,
        enabled: !!params.questionnaireId && !!targetClassId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSummaryRw = (params: SummaryRwParams) => {
    return useSummaryGrade(params) as unknown as ReturnType<typeof useQuery<RWSummaryResponse, Error>>;
};

export const useSummaryRt = (params: SummaryRtParams) => {
    return useSummaryClass(params) as unknown as ReturnType<typeof useQuery<RTSummaryResponse, Error>>;
};
