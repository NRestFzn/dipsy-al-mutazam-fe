import type { ResponseData } from "../commons";

export interface GradeItem {
  id: string;
  name: string;
  classCount?: number;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  gradeId?: string;
  RukunWargaId?: string; // fallback mapping
  grade?: GradeItem;
  homeroomTeacher?: string;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAdminItem {
  id: string;
  fullname: string;
  nisn: string;
  nik?: string;
  email?: string | null;
  phoneNumber?: string | null;
  gender: "m" | "f";
  birthDate: string;
  gradeLevelId?: string;
  RukunWargaId?: string; // fallback mapping
  classroomId?: string;
  RukunTetanggaId?: string; // fallback mapping
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
  homeroomTeacher?: string;
  count?: number;
}

export interface UpdateClassPayload {
  name: string;
  gradeId: string;
  homeroomTeacher?: string;
}

export interface CreateStudentAdminPayload {
  fullname: string;
  nisn: string;
  nik?: string;
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
  nik?: string;
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
  RukunWargaId?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface GetStudentsAdminParams {
  search?: string;
  fullname?: string;
  nisn?: string;
  nik?: string;
  gradeLevelId?: string;
  RukunWargaId?: string;
  classroomId?: string;
  RukunTetanggaId?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export type GradeResponse = ResponseData<GradeItem[]>;
export type ClassResponse = ResponseData<ClassItem[]>;
export type StudentAdminResponse = ResponseData<StudentAdminItem[]>;

