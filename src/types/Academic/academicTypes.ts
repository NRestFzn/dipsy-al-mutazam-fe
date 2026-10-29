import type { ResponseData } from "../commons";

export interface GradeItem {
  id: string;
  name: string;
  level?: "SMP" | "SMA" | null;
  classCount?: number;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  gradeId?: string;
  grade?: GradeItem;
  homeroomTeacherId?: string | null;
  homeroomTeacher?: { id: string; fullname: string } | null;
  academicYear?: string | null;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAdminItem {
  id: string;
  fullname: string;
  nisn: string;
  email?: string | null;
  phoneNumber?: string | null;
  gender: "m" | "f";
  birthDate: string;
  gradeLevelId?: string;
  classroomId?: string;
  gradeLevel?: { id: string; name: string };
  classroom?: { id: string; name: string };
  studentStatus?: "aktif" | "lulus" | "pindah";
  graduationYear?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGradePayload {
  name: string;
  count?: number;
}

export interface UpdateGradePayload {
  name: string;
}

export interface CreateClassPayload {
  name: string;
  gradeId: string;
  homeroomTeacherId?: string | null;
  academicYear?: string | null;
}

export interface UpdateClassPayload {
  name: string;
  gradeId: string;
  homeroomTeacherId?: string | null;
  academicYear?: string | null;
}

export interface CreateStudentAdminPayload {
  fullname: string;
  nisn: string;
  email?: string | null;
  phoneNumber?: string | null;
  gender: "m" | "f";
  birthDate: string;
  gradeLevelId: string;
  classroomId: string;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateStudentAdminPayload {
  fullname: string;
  nisn: string;
  email?: string | null;
  phoneNumber?: string | null;
  gender: "m" | "f";
  birthDate: string;
  gradeLevelId: string;
  classroomId: string;
  studentStatus?: "aktif" | "pindah" | null;
}

export interface GetGradesParams {
  name?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface GetClassesParams {
  name?: string;
  gradeId?: string;
  academicYear?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface GetStudentsAdminParams {
  fullname?: string;
  nisn?: string;
  gradeLevelId?: string;
  classroomId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface PromotionItemPayload {
  studentId: string;
  targetGradeId: string;
  targetClassId: string;
  notes?: string | null;
}

export interface PromoteStudentsPayload {
  academicYear: string;
  promotions: PromotionItemPayload[];
}

export interface GraduateStudentsPayload {
  studentIds: string[];
  graduationYear: string;
}

export interface TaughtStudentItem {
  id: string;
  fullname: string;
  email?: string;
  userDetail?: {
    nisn?: string | null;
    nis?: string | null;
    studentStatus?: "aktif" | "lulus" | "pindah" | null;
    graduationYear?: string | null;
  } | null;
}

export interface TaughtHistoryItem {
  id: string;
  academicYear: string;
  GradeId?: string | null;
  ClassId?: string | null;
  homeroomTeacherId?: string | null;
  student?: TaughtStudentItem | null;
  grade?: { id: string; name: string } | null;
  class?: { id: string; name: string } | null;
}

export interface AcademicHistoryItem {
  id: string;
  academicYear: string;
  GradeId?: string | null;
  ClassId?: string | null;
  homeroomTeacherId?: string | null;
  notes?: string | null;
  grade?: { id: string; name: string } | null;
  class?: { id: string; name: string } | null;
  homeroomTeacher?: { id: string; fullname: string } | null;
  createdAt?: string;
}

export type GradeResponse = ResponseData<GradeItem[]>;
export type ClassResponse = ResponseData<ClassItem[]>;
export type StudentAdminResponse = ResponseData<StudentAdminItem[]>;
