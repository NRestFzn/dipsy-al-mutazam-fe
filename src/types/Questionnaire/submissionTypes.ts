export interface SubmitParams {
    id: string;
    answers: Record<string, string>;
    residentId?: string;
    studentId?: string;
    activeRoleId?: string;
}

export interface AnswerSubmission {
    QuestionId: string;
    answerValue: string;
}

export interface SubmitAnswersRequest {
    UserId?: string;
    answers: AnswerSubmission[];
}

export interface SummaryRwParams {
    questionnaireId: string;
    RukunWargaId?: string;
    gradeId?: string;
    startDate?: string;
    endDate?: string;
}

export type SummaryGradeParams = SummaryRwParams;

export interface SummaryStats {
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
}

export interface PerRtData {
    rtId: string;
    rtName: number | string;
    classId?: string;
    className?: string;
    userCount: number;
    submitCount: number;
    stableMentalCount: number;
    unStableMentalCount: number;
    unStableMentalPercentage: number;
}

export type PerClassData = PerRtData;

export interface RWSummaryData {
    summarize: SummaryStats;
    perRt?: PerRtData[];
    perClass?: PerRtData[];
}

export type GradeSummaryData = RWSummaryData;

export interface SummaryRtParams {
    questionnaireId: string;
    rwId?: string;
    rtId?: string;
    gradeId?: string;
    classId?: string;
    startDate?: string;
    endDate?: string;
}

export type SummaryClassParams = SummaryRtParams & { academicYear?: string };

export interface RtUserItem {
    UserId: string;
    fullname: string;
    nisn?: string;
    lastSubmissionDate: string;
    isMentalUnStable: boolean;
}

export type StudentSummaryItem = RtUserItem;

export interface RtSummaryData {
    summarize: SummaryStats;
    users?: RtUserItem[];
    students?: RtUserItem[];
}

export type ClassSummaryData = RtSummaryData;

export interface SubmissionScore {
    score: number;
    resultKey: string;
    resultLabel: string;
    isMentalUnStable: boolean;
}
