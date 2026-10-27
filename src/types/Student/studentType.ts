import type { UserMe } from "../profileTypes";

export interface GradeRef {
    id: string;
    name: string;
}

export interface ClassRef {
    id: string;
    name: string;
}

export interface UserDetail {
    id: string;
    UserId: string;

    nisn?: string | null;
    nis?: string | null;
    entryYear?: string | null;
    academicYear?: string | null;

    phoneNumber?: string | null;
    gender: string;
    birthDate: string;

    GradeId?: string | null;
    ClassId?: string | null;

    /** @deprecated sisa domain desa; dipakai dashboard kader yang diganti di issue #5 */
    RukunWargaId?: string | null;
    /** @deprecated */
    RukunTetanggaId?: string | null;

    /** relasi dari BE, alias mengikuti asosiasi model (lowercase) */
    grade?: GradeRef | null;
    class?: ClassRef | null;

    createdAt: string;
    updatedAt: string;
}

export interface StudentMe extends UserMe {
    userDetail: UserDetail
}

export interface UpdateProfileStudentPayload {
    phoneNumber?: string | null;
    password?: string | null;
    confirmNewPassword?: string | null;
}

export interface StudentData extends UserMe {
    userDetail: UserDetail;
}

/** dipakai tab Data Siswa di Kelola Akademik (issue #4) */
export type ResidentData = StudentData;

export interface GetResidentsParams {
    page?: number;
    pageSize?: number;
    fullname?: string;
    nisn?: string;
    GradeId?: string;
    ClassId?: string;
    order?: string;
    /** @deprecated filter lama tab Data Siswa; diganti GradeId/ClassId di issue #4 */
    nik?: string;
    /** @deprecated */
    RukunWargaId?: string;
    /** @deprecated */
    RukunTetanggaId?: string;
}

/** masih dipakai form admin lama; diganti di issue #4 */
export interface CreateResidentPayload {
    fullname: string;
    email?: string | null;
    gender: "m" | "f";
    birthDate: string;
    nisn: string;
    GradeId: string;
    ClassId: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string | null;
    nis?: string | null;
    entryYear?: string | null;
    academicYear?: string | null;
}
