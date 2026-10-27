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
}

export interface UpdateClassPayload {
  name: string;
  gradeId: string;
  homeroomTeacherId?: string | null;
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
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface GetStudentsAdminParams {
  fullname?: string;
  nisn?: string;
  gradeLevelId?: string;
  classroomId?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export type GradeResponse = ResponseData<GradeItem[]>;
export type ClassResponse = ResponseData<ClassItem[]>;
export type StudentAdminResponse = ResponseData<StudentAdminItem[]>;
