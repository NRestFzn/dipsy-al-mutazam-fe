export interface TeacherRole {
  id: string;
  name: string;
}

export interface TeacherClass {
  id: string;
  name: string;
  gradeName?: string | null;
}

export interface TeacherItem {
  id: string;
  fullname: string;
  email: string;
  profilePicture?: string | null;
  roles: TeacherRole[];
  homeroomClasses: TeacherClass[];
  counselorClasses?: TeacherClass[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTeachersParams {
  search?: string;
  roleName?: string;
  academicYear?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateTeacherPayload {
  fullname: string;
  email: string;
  password: string;
  roleName: "gurubk" | "walikelas";
}

export interface UpdateTeacherPayload {
  fullname?: string;
  email?: string;
  password?: string | null;
  roleName?: "gurubk" | "walikelas";
}

export interface TeacherListResponse {
  statusCode: number;
  message: string;
  data: TeacherItem[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
