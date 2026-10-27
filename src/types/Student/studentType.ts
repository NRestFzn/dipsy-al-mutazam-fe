import type { Education, MarriageStatus, RukunTetangga, RukunWarga, SalaryRange } from "../masterDataTypes";
import type { UserMe } from "../profileTypes";
import type { AcademicHistoryItem } from "../Academic/academicTypes";

export interface UserDetail {
    id: string;
    nik: string;
    nisn?: string;
    profession?: string;
    phoneNumber?: string;
    gender: string;
    birthDate: string;
    UserId: string;

    GradeId?: string;
    ClassId?: string;
    RukunWargaId?: string;
    RukunTetanggaId?: string;
    gradeLevelId?: string;
    classroomId?: string;
    status?: "Aktif" | "Lulus";
    academicHistory?: AcademicHistoryItem[];
    MarriageStatusId?: string;
    EducationId?: string;
    SalaryRangeId?: string;

    grade?: { id: string; name: string };
    class?: { id: string; name: string };
    rukunWarga?: RukunWarga;
    rukunTetangga?: RukunTetangga;
    marriageStatus?: MarriageStatus;
    education?: Education;
    salaryRange?: SalaryRange;
    gradeLevel?: { id: string; name: string };
    classroom?: { id: string; name: string };
    createdAt: string;
    updatedAt: string;
}

export interface StudentMe extends UserMe {
    userDetail: UserDetail;
}

export interface UpdateProfileStudentPayload {
    phoneNumber: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

export interface ResidentData extends UserMe {
    userDetail: UserDetail;
}

export interface GetResidentsParams {
    page?: number;
    pageSize?: number;
    fullname?: string;
    nik?: string;
    nisn?: string;
    RukunWargaId?: string;
    RukunTetanggaId?: string;
    GradeId?: string;
    ClassId?: string;
    order?: string;
    status?: string;
}
