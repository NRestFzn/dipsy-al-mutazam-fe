import { api } from "../api";
import type {
  ClassItem,
  ClassResponse,
  CreateClassPayload,
  CreateGradePayload,
  CreateStudentAdminPayload,
  GetClassesParams,
  GetGradesParams,
  GetStudentsAdminParams,
  GradeItem,
  GradeResponse,
  StudentAdminItem,
  StudentAdminResponse,
  UpdateClassPayload,
  UpdateGradePayload,
  UpdateStudentAdminPayload,
} from "../../types/Academic/academicTypes";

export const academicService = {
  // ===================== GRADE / TINGKAT =====================
  getGrades: async (params?: GetGradesParams): Promise<GradeResponse> => {
    const response = await api.get<any>("/v1/grade", { params });
    const rawResponse = response.data;
    const mappedData: GradeItem[] = (rawResponse.data || []).map((rw: any) => ({
      id: String(rw.id),
      name: rw.name?.startsWith("Tingkat") || rw.name?.startsWith("Kelas") ? rw.name : `Tingkat ${rw.name}`,
      level: rw.level,
      classCount: rw.classCount ?? 0,
      studentCount: rw.studentCount ?? 0,
    }));
    return {
      ...rawResponse,
      data: mappedData,
    };
  },

  createGrade: async (payload: CreateGradePayload) => {
    const response = await api.post("/v1/grade", {
      name: payload.name,
      level: payload.level,
    });
    return response.data;
  },

  updateGrade: async (id: string, payload: UpdateGradePayload) => {
    const response = await api.put(`/v1/grade/${id}`, {
      name: payload.name,
      level: payload.level,
    });
    return response.data;
  },

  deleteGrade: async (id: string) => {
    const response = await api.delete(`/v1/grade/${id}`);
    return response.data;
  },

  // ===================== CLASS / KELAS =====================
  getClasses: async (params?: GetClassesParams): Promise<ClassResponse> => {
    const selectedGrade = params?.gradeId || params?.GradeId || params?.RukunWargaId;
    const queryParams: any = { ...params };
    if (selectedGrade) {
      queryParams.GradeId = selectedGrade;
    }
    const response = await api.get<any>("/v1/class", { params: queryParams });
    const rawResponse = response.data;
    const mappedData: ClassItem[] = (rawResponse.data || []).map((rt: any) => ({
      id: String(rt.id),
      name: rt.name?.startsWith("Kelas") ? rt.name : `Kelas ${rt.name}`,
      gradeId: String(rt.GradeId || rt.grade?.id || ""),
      studentCount: rt.studentCount ?? 0,
      homeroomTeacher: rt.homeroomTeacher?.fullname || rt.homeroomTeacher || undefined,
      homeroomTeacherId: rt.homeroomTeacherId || rt.homeroomTeacher?.id,
    }));
    return {
      ...rawResponse,
      data: mappedData,
    };
  },

  createClass: async (payload: CreateClassPayload) => {
    const body = {
      name: payload.name,
      GradeId: payload.gradeId || payload.GradeId,
      homeroomTeacherId: payload.homeroomTeacherId || payload.homeroomTeacher,
    };
    const response = await api.post("/v1/class", body);
    return response.data;
  },

  updateClass: async (id: string, payload: UpdateClassPayload) => {
    const body: any = {
      name: payload.name,
      GradeId: payload.gradeId || payload.GradeId,
      homeroomTeacherId: payload.homeroomTeacherId || payload.homeroomTeacher,
    };
    const response = await api.put(`/v1/class/${id}`, body);
    return response.data;
  },

  deleteClass: async (id: string) => {
    const response = await api.delete(`/v1/class/${id}`);
    return response.data;
  },

  // ===================== STUDENTS / SISWA =====================
  getStudents: async (params?: GetStudentsAdminParams): Promise<StudentAdminResponse> => {
    const queryParams: any = {
      ...params,
      GradeId: params?.gradeLevelId || params?.GradeId || params?.RukunWargaId,
      ClassId: params?.classroomId || params?.ClassId || params?.RukunTetanggaId,
    };
    const response = await api.get<any>("/v1/student", { params: queryParams });
    const rawResponse = response.data;

    const mappedData: StudentAdminItem[] = (rawResponse.data || []).map((res: any) => {
      const gradeObj = res.userDetail?.grade;
      const classObj = res.userDetail?.class;
      const gradeName = gradeObj?.name
        ? (gradeObj.name.startsWith("Tingkat") ? gradeObj.name : `Tingkat ${gradeObj.name}`)
        : "-";
      const className = classObj?.name
        ? (classObj.name.startsWith("Kelas") ? classObj.name : `Kelas ${classObj.name}`)
        : "-";

      return {
        id: String(res.id),
        fullname: res.fullname,
        nisn: res.userDetail?.nisn || res.nisn || "-",
        email: res.email,
        phoneNumber: res.userDetail?.phoneNumber || res.phoneNumber || "-",
        gender: res.userDetail?.gender || res.gender || "m",
        birthDate: res.userDetail?.birthDate || res.birthDate || "",
        gradeLevelId: String(res.userDetail?.GradeId || ""),
        classroomId: String(res.userDetail?.ClassId || ""),
        gradeLevel: {
          id: String(gradeObj?.id || res.userDetail?.GradeId || ""),
          name: gradeName,
        },
        classroom: {
          id: String(classObj?.id || res.userDetail?.ClassId || ""),
          name: className,
        },
      };
    });

    return {
      ...rawResponse,
      data: mappedData,
    };
  },

  getStudentDetail: async (id: string): Promise<{ data: StudentAdminItem }> => {
    const response = await api.get<any>(`/v1/student/${id}`);
    const res = response.data.data;

    const gradeObj = res.userDetail?.grade;
    const classObj = res.userDetail?.class;
    const gradeName = gradeObj?.name
      ? (gradeObj.name.startsWith("Tingkat") ? gradeObj.name : `Tingkat ${gradeObj.name}`)
      : "-";
    const className = classObj?.name
      ? (classObj.name.startsWith("Kelas") ? classObj.name : `Kelas ${classObj.name}`)
      : "-";

    const mapped: StudentAdminItem = {
      id: String(res.id),
      fullname: res.fullname,
      nisn: res.userDetail?.nisn || res.nisn || "-",
      email: res.email,
      phoneNumber: res.userDetail?.phoneNumber || res.phoneNumber || "-",
      gender: res.userDetail?.gender || res.gender || "m",
      birthDate: res.userDetail?.birthDate || res.birthDate || "",
      gradeLevelId: String(res.userDetail?.GradeId || ""),
      classroomId: String(res.userDetail?.ClassId || ""),
      gradeLevel: {
        id: String(gradeObj?.id || res.userDetail?.GradeId || ""),
        name: gradeName,
      },
      classroom: {
        id: String(classObj?.id || res.userDetail?.ClassId || ""),
        name: className,
      },
    };
    return { data: mapped };
  },

  createStudent: async (payload: CreateStudentAdminPayload) => {
    const body = {
      fullname: payload.fullname,
      nisn: payload.nisn,
      email: payload.email || undefined,
      phoneNumber: payload.phoneNumber || undefined,
      gender: payload.gender || "m",
      birthDate: payload.birthDate,
      GradeId: payload.gradeLevelId || payload.GradeId,
      ClassId: payload.classroomId || payload.ClassId,
      password: payload.password || "Password123!",
      confirmPassword: payload.confirmPassword || payload.password || "Password123!",
      nis: payload.nis,
      entryYear: payload.entryYear,
      academicYear: payload.academicYear,
    };
    const response = await api.post("/v1/student", body);
    return response.data;
  },

  updateStudent: async (id: string, payload: UpdateStudentAdminPayload) => {
    const body: any = {
      fullname: payload.fullname,
      nisn: payload.nisn,
      email: payload.email || `${payload.nisn}@al-multazam.sch.id`,
      phoneNumber: payload.phoneNumber || undefined,
      gender: payload.gender || "m",
      birthDate: payload.birthDate,
      GradeId: payload.gradeLevelId || payload.GradeId,
      ClassId: payload.classroomId || payload.ClassId,
      nis: payload.nis,
      entryYear: payload.entryYear,
      academicYear: payload.academicYear,
    };
    if (payload.password) {
      body.password = payload.password;
      body.confirmPassword = payload.confirmPassword || payload.password;
    }
    const response = await api.put(`/v1/student/${id}`, body);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/v1/student/${id}`);
    return response.data;
  },
};
