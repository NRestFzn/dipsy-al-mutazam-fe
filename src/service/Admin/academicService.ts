import { api } from "../api";
import type { ResponseData } from "../../types/commons";
import type {
  AcademicHistoryItem,
  ClassItem,
  ClassResponse,
  CreateClassPayload,
  CreateStudentAdminPayload,
  GetClassesParams,
  GetGradesParams,
  GetStudentsAdminParams,
  GradeItem,
  GraduateStudentsPayload,
  GradeResponse,
  StudentAdminItem,
  StudentAdminResponse,
  TaughtHistoryItem,
  PromoteStudentsPayload,
  UpdateClassPayload,
  UpdateStudentAdminPayload,
} from "../../types/Academic/academicTypes";

const mapGrade = (grade: any): GradeItem => ({
  id: String(grade.id),
  name: grade.name,
  level: grade.level ?? null,
  classCount: grade.classCount ?? 0,
  studentCount: grade.studentCount ?? 0,
  createdAt: grade.createdAt,
  updatedAt: grade.updatedAt,
});

const mapClass = (item: any): ClassItem => ({
  id: String(item.id),
  name: item.name,
  gradeId: item.GradeId ?? item.gradeId ?? undefined,
  homeroomTeacherId: item.homeroomTeacherId ?? null,
  homeroomTeacher: item.homeroomTeacher
    ? { id: String(item.homeroomTeacher.id), fullname: item.homeroomTeacher.fullname }
    : undefined,
  studentCount: item.studentCount ?? 0,
  academicYear: item.academicYear ?? null,
  grade: item.grade ? mapGrade(item.grade) : undefined,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapStudent = (item: any): StudentAdminItem => {
  const detail = item.userDetail ?? {};

  return {
    id: String(item.id),
    fullname: item.fullname,
    nisn: detail.nisn ?? "-",
    email: item.email ?? null,
    phoneNumber: detail.phoneNumber ?? null,
    gender: detail.gender ?? "m",
    birthDate: detail.birthDate ?? "",
    gradeLevelId: detail.GradeId ?? undefined,
    classroomId: detail.ClassId ?? undefined,
    gradeLevel: detail.grade
      ? { id: String(detail.grade.id), name: detail.grade.name }
      : undefined,
    classroom: detail.class
      ? { id: String(detail.class.id), name: detail.class.name }
      : undefined,
    studentStatus: detail.studentStatus ?? "aktif",
    graduationYear: detail.graduationYear ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const academicService = {
  // ===================== GRADE / TINGKAT (read-only) =====================
  getGrades: async (params?: GetGradesParams): Promise<GradeResponse> => {
    const response = await api.get<GradeResponse>("/v1/grade", { params });

    return {
      ...response.data,
      data: (response.data.data || []).map(mapGrade),
    };
  },

  // ===================== CLASS / KELAS =====================
  getClasses: async (params?: GetClassesParams): Promise<ClassResponse> => {
    const response = await api.get<ClassResponse>("/v1/class", {
      params: {
        name: params?.name,
        GradeId: params?.gradeId,
        academicYear: params?.academicYear,
        page: params?.page,
        pageSize: params?.pageSize,
        order: params?.order,
      },
    });

    return {
      ...response.data,
      data: (response.data.data || []).map(mapClass),
    };
  },

  createClass: async (payload: CreateClassPayload) => {
    const response = await api.post("/v1/class", {
      name: payload.name,
      GradeId: payload.gradeId,
      homeroomTeacherId: payload.homeroomTeacherId ?? null,
      academicYear: payload.academicYear ?? undefined,
    });

    return response.data;
  },

  updateClass: async (id: string, payload: UpdateClassPayload) => {
    const response = await api.put(`/v1/class/${id}`, {
      name: payload.name,
      GradeId: payload.gradeId,
      homeroomTeacherId: payload.homeroomTeacherId ?? null,
      academicYear: payload.academicYear ?? undefined,
    });

    return response.data;
  },

  deleteClass: async (id: string) => {
    const response = await api.delete(`/v1/class/${id}`);

    return response.data;
  },

  // ===================== STUDENTS / SISWA =====================
  getStudents: async (
    params?: GetStudentsAdminParams
  ): Promise<StudentAdminResponse> => {
    const response = await api.get<StudentAdminResponse>("/v1/student", {
      params: {
        fullname: params?.fullname,
        nisn: params?.nisn,
        GradeId: params?.gradeLevelId,
        ClassId: params?.classroomId,
        status: params?.status,
        page: params?.page,
        pageSize: params?.pageSize,
        order: params?.order,
      },
    });

    return {
      ...response.data,
      data: (response.data.data || []).map(mapStudent),
    };
  },

  getStudentDetail: async (id: string): Promise<{ data: StudentAdminItem }> => {
    const response = await api.get<any>(`/v1/student/${id}`);

    return { data: mapStudent(response.data.data) };
  },

  createStudent: async (payload: CreateStudentAdminPayload) => {
    const response = await api.post("/v1/student", {
      fullname: payload.fullname,
      nisn: payload.nisn,
      email: payload.email ?? null,
      phoneNumber: payload.phoneNumber ?? null,
      gender: payload.gender,
      birthDate: payload.birthDate,
      GradeId: payload.gradeLevelId,
      ClassId: payload.classroomId,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    });

    return response.data;
  },

  updateStudent: async (id: string, payload: UpdateStudentAdminPayload) => {
    const response = await api.put(`/v1/student/${id}`, {
      fullname: payload.fullname,
      nisn: payload.nisn,
      email: payload.email,
      phoneNumber: payload.phoneNumber ?? null,
      gender: payload.gender,
      birthDate: payload.birthDate,
      GradeId: payload.gradeLevelId,
      ClassId: payload.classroomId,
      studentStatus: payload.studentStatus ?? undefined,
    });

    return response.data;
  },

  promoteStudents: async (payload: PromoteStudentsPayload) => {
    const response = await api.post("/v1/student/promotion", payload);

    return response.data;
  },

  graduateStudents: async (payload: GraduateStudentsPayload) => {
    const response = await api.post("/v1/student/graduation", payload);

    return response.data;
  },

  getTaughtHistory: async () => {
    const response = await api.get<ResponseData<TaughtHistoryItem[]>>(
      "/v1/student/taught-history"
    );

    return response.data;
  },

  getAcademicHistory: async (studentId: string) => {
    const response = await api.get<{ data: AcademicHistoryItem[] }>(
      `/v1/student/${studentId}/academic-history`
    );

    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/v1/student/${id}`);

    return response.data;
  },
};
