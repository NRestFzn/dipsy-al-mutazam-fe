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
    try {
      const response = await api.get<GradeResponse>("/v1/grade", { params });
      return response.data;
    } catch {
      // Fallback ke /v1/rukun-warga bila backend belum switch route
      const response = await api.get<any>("/v1/rukun-warga", { params });
      const mappedData: GradeItem[] = (response.data.data || []).map((rw: any) => ({
        id: String(rw.id),
        name: rw.name?.startsWith("Kelas") ? rw.name : `Tingkat ${rw.name}`,
        classCount: rw.rtCount ?? rw.classCount ?? 0,
        studentCount: rw.wargaCount ?? rw.studentCount ?? 0,
      }));
      return {
        ...response.data,
        data: mappedData,
      };
    }
  },

  createGrade: async (payload: CreateGradePayload) => {
    try {
      const response = await api.post("/v1/grade", payload);
      return response.data;
    } catch {
      // Fallback ke create RW
      const response = await api.post("/v1/rukun-warga", { count: payload.count || 1 });
      return response.data;
    }
  },

  updateGrade: async (id: string, payload: UpdateGradePayload) => {
    try {
      const response = await api.put(`/v1/grade/${id}`, payload);
      return response.data;
    } catch {
      const response = await api.put(`/v1/rukun-warga/${id}`, payload);
      return response.data;
    }
  },

  deleteGrade: async (id: string) => {
    try {
      const response = await api.delete(`/v1/grade/${id}`);
      return response.data;
    } catch {
      const response = await api.delete(`/v1/rukun-warga/${id}`);
      return response.data;
    }
  },

  // ===================== CLASS / KELAS =====================
  getClasses: async (params?: GetClassesParams): Promise<ClassResponse> => {
    const selectedGrade = params?.gradeId || params?.RukunWargaId;

    try {
      const response = await api.get<ClassResponse>("/v1/class", { params });
      return response.data;
    } catch {
      const response = await api.get<any>("/v1/rukun-tetangga", {
        params: {
          ...params,
          RukunWargaId: selectedGrade,
        },
      });
      const mappedData: ClassItem[] = (response.data.data || []).map((rt: any) => ({
        id: String(rt.id),
        name: rt.name?.startsWith("Kelas") ? rt.name : `Kelas ${rt.name}`,
        gradeId: String(rt.RukunWargaId),
        RukunWargaId: String(rt.RukunWargaId),
        studentCount: rt.wargaCount ?? 0,
      }));
      return {
        ...response.data,
        data: mappedData,
      };
    }
  },

  createClass: async (payload: CreateClassPayload) => {
    try {
      const response = await api.post("/v1/class", payload);
      return response.data;
    } catch {
      const response = await api.post("/v1/rukun-tetangga", {
        count: payload.count || 1,
        RukunWargaId: payload.gradeId,
      });
      return response.data;
    }
  },

  updateClass: async (id: string, payload: UpdateClassPayload) => {
    try {
      const response = await api.put(`/v1/class/${id}`, payload);
      return response.data;
    } catch {
      const response = await api.put(`/v1/rukun-tetangga/${id}`, payload);
      return response.data;
    }
  },

  deleteClass: async (id: string) => {
    try {
      const response = await api.delete(`/v1/class/${id}`);
      return response.data;
    } catch {
      const response = await api.delete(`/v1/rukun-tetangga/${id}`);
      return response.data;
    }
  },

  // ===================== STUDENTS / SISWA =====================
  getStudents: async (params?: GetStudentsAdminParams): Promise<StudentAdminResponse> => {
    try {
      const response = await api.get<StudentAdminResponse>("/v1/student", { params });
      return response.data;
    } catch {
      const response = await api.get<any>("/v1/resident", {
        params: {
          ...params,
          RukunWargaId: params?.gradeLevelId || params?.RukunWargaId,
          RukunTetanggaId: params?.classroomId || params?.RukunTetanggaId,
        },
      });

      const mappedData: StudentAdminItem[] = (response.data.data || []).map((res: any) => ({
        id: String(res.id),
        fullname: res.fullname,
        nisn: res.userDetail?.nisn || res.userDetail?.nik || res.nik || "-",
        nik: res.userDetail?.nik || res.nik,
        email: res.email,
        phoneNumber: res.userDetail?.phoneNumber || res.phoneNumber,
        gender: res.gender || res.userDetail?.gender || "m",
        birthDate: res.birthDate || res.userDetail?.birthDate || "",
        gradeLevelId: String(res.userDetail?.RukunWargaId || ""),
        classroomId: String(res.userDetail?.RukunTetanggaId || ""),
        gradeLevel: res.userDetail?.gradeLevel || {
          id: String(res.userDetail?.RukunWargaId || ""),
          name: `Tingkat ${res.userDetail?.RukunWarga?.name || ""}`,
        },
        classroom: res.userDetail?.classroom || {
          id: String(res.userDetail?.RukunTetanggaId || ""),
          name: `Kelas ${res.userDetail?.RukunTetangga?.name || ""}`,
        },
      }));

      return {
        ...response.data,
        data: mappedData,
      };
    }
  },

  getStudentDetail: async (id: string): Promise<{ data: StudentAdminItem }> => {
    try {
      const response = await api.get<{ data: StudentAdminItem }>(`/v1/student/${id}`);
      return response.data;
    } catch {
      const response = await api.get<any>(`/v1/resident/${id}`);
      const res = response.data.data;
      const mapped: StudentAdminItem = {
        id: String(res.id),
        fullname: res.fullname,
        nisn: res.userDetail?.nisn || res.userDetail?.nik || res.nik || "-",
        nik: res.userDetail?.nik || res.nik,
        email: res.email,
        phoneNumber: res.userDetail?.phoneNumber || res.phoneNumber,
        gender: res.gender || res.userDetail?.gender || "m",
        birthDate: res.birthDate || res.userDetail?.birthDate || "",
        gradeLevelId: String(res.userDetail?.RukunWargaId || ""),
        classroomId: String(res.userDetail?.RukunTetanggaId || ""),
        gradeLevel: res.userDetail?.gradeLevel,
        classroom: res.userDetail?.classroom,
      };
      return { data: mapped };
    }
  },

  createStudent: async (payload: CreateStudentAdminPayload) => {
    const payloadWithFallbacks = {
      ...payload,
      nik: payload.nisn,
      RukunWargaId: payload.gradeLevelId,
      RukunTetanggaId: payload.classroomId,
      profession: "Siswa",
      EducationId: "1",
      MarriageStatusId: "1",
      SalaryRangeId: "1",
      isKader: false,
    };

    try {
      const response = await api.post("/v1/student", payloadWithFallbacks);
      return response.data;
    } catch {
      const response = await api.post("/v1/resident", payloadWithFallbacks);
      return response.data;
    }
  },

  updateStudent: async (id: string, payload: UpdateStudentAdminPayload) => {
    const payloadWithFallbacks = {
      ...payload,
      nik: payload.nisn,
      RukunWargaId: payload.gradeLevelId,
      RukunTetanggaId: payload.classroomId,
      profession: "Siswa",
    };

    try {
      const response = await api.put(`/v1/student/${id}`, payloadWithFallbacks);
      return response.data;
    } catch {
      const response = await api.put(`/v1/resident/${id}`, payloadWithFallbacks);
      return response.data;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await api.delete(`/v1/student/${id}`);
      return response.data;
    } catch {
      const response = await api.delete(`/v1/resident/${id}`);
      return response.data;
    }
  },
};
