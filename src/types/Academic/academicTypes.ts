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
  GradeId?: string;
  RukunWargaId?: string; // fallback mapping
  grade?: GradeItem;
  homeroomTeacher?: string;
  homeroomTeacherId?: string;
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
  classroomId?: string;
  gradeLevel?: { id: string; name: string };
  classroom?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGradePayload {
  name: string;
  level?: "SMP" | "SMA";
  count?: number;
}

export interface UpdateGradePayload {
  name?: string;
  level?: "SMP" | "SMA";
}

export interface CreateClassPayload {
  name: string;
  gradeId: string;
  GradeId?: string;
  homeroomTeacher?: string;
  homeroomTeacherId?: string;
  count?: number;
}

export interface UpdateClassPayload {
  name?: string;
  gradeId?: string;
  GradeId?: string;
  homeroomTeacher?: string;
  homeroomTeacherId?: string;
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
  GradeId?: string;
  ClassId?: string;
  nis?: string;
  entryYear?: string;
  academicYear?: string;
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
  GradeId?: string;
  ClassId?: string;
  nis?: string;
  entryYear?: string;
  academicYear?: string;
  password?: string;
  confirmPassword?: string;
}

export interface GetGradesParams {
  name?: string;
  level?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export interface GetClassesParams {
  name?: string;
  gradeId?: string;
  GradeId?: string;
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
  GradeId?: string;
  RukunWargaId?: string;
  classroomId?: string;
  ClassId?: string;
  RukunTetanggaId?: string;
  page?: number;
  pageSize?: number;
  order?: string;
}

export type GradeResponse = ResponseData<GradeItem[]>;
export type ClassResponse = ResponseData<ClassItem[]>;
export type StudentAdminResponse = ResponseData<StudentAdminItem[]>;
