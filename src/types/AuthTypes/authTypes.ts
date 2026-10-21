import type { UserDetail } from "../Student/studentType";

export interface UserHasRoles {
  id: string;
  createdAt: string;
  updatedAt: string;
  RoleId: string;
  UserId: string;
}

export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  UserHasRoles?: UserHasRoles;
}

export interface UserMeResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  gender?: string;
  birthDate?: string;
  profilePicture: string | null;
  roles: Role[];
  accessToken?: string;
  userDetail?: UserDetail
}

export interface AuthResponse {
  uid: string;
  fullname: string;
  email: string;
  RoleIds: string[]
  accessToken?: string;
  expiresAt?: string;
  expiresIn?: number
}

export interface LoginPayload {
  email: string;
  RoleId?: string
  password: string;
}

export interface LoginStudentPayload {
  nisn: string,
  password: string
}

export interface RegisterPayload {
  fullname: string;
  nisn?: string;
  nik?: string;
  email?: string | null;
  password: string;
  confirmPassword: string;
  gender: "m" | "f";
  birthDate: string;
  GradeId?: string;
  ClassId?: string;
  RukunWargaId?: string;
  RukunTetanggaId?: string;
  profession?: string;
  MarriageStatusId?: string;
  EducationId?: string;
  SalaryRangeId?: string;
  phoneNumber?: string | null;
  nis?: string;
  entryYear?: string;
  academicYear?: string;
}
