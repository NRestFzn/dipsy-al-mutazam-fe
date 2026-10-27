import { api } from "../api";
import { mockDatabase } from "../mock/mockDatabase";
import type {
  ClassItem,
  ClassPromotionPayload,
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
    } catch {
      return mockDatabase.getGrades(params);
    }
  },

  createGrade: async (payload: CreateGradePayload) => {
    try {
      const response = await api.post("/v1/grade", {
        name: payload.name,
        level: payload.level,
      });
      return response.data;
    } catch {
      return { statusCode: 201, message: "Berhasil menambahkan tingkat (Mock)" };
    }
  },

  updateGrade: async (id: string, payload: UpdateGradePayload) => {
    try {
      const response = await api.put(`/v1/grade/${id}`, {
        name: payload.name,
        level: payload.level,
      });
      return response.data;
    } catch {
      return { statusCode: 200, message: "Berhasil memperbarui tingkat (Mock)" };
    }
  },

  deleteGrade: async (id: string) => {
    try {
      const response = await api.delete(`/v1/grade/${id}`);
      return response.data;
    } catch {
      return { statusCode: 200, message: "Berhasil menghapus tingkat (Mock)" };
    }
  },

  // ===================== CLASS / KELAS =====================
  getClasses: async (params?: GetClassesParams): Promise<ClassResponse> => {
    try {
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
    } catch {
      return mockDatabase.getClasses(params);
    }
  },

  createClass: async (payload: CreateClassPayload) => {
    try {
      const body = {
        name: payload.name,
        GradeId: payload.gradeId || payload.GradeId,
        homeroomTeacherId: payload.homeroomTeacherId || payload.homeroomTeacher,
      };
      const response = await api.post("/v1/class", body);
      return response.data;
    } catch {
      return mockDatabase.createClass(payload);
    }
  },

  updateClass: async (id: string, payload: UpdateClassPayload) => {
    try {
      const body: any = {
        name: payload.name,
        GradeId: payload.gradeId || payload.GradeId,
        homeroomTeacherId: payload.homeroomTeacherId || payload.homeroomTeacher,
      };
      const response = await api.put(`/v1/class/${id}`, body);
      return response.data;
    } catch {
      return mockDatabase.updateClass(id, payload);
    }
  },

  deleteClass: async (id: string) => {
    try {
      const response = await api.delete(`/v1/class/${id}`);
      return response.data;
    } catch {
      mockDatabase.deleteClass(id);
      return { statusCode: 200, message: "Berhasil menghapus kelas" };
    }
  },

  // ===================== STUDENTS / SISWA =====================
  getStudents: async (params?: GetStudentsAdminParams): Promise<StudentAdminResponse> => {
    try {
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
          ? (gradeObj.name.startsWith("Tingkat") || gradeObj.name.startsWith("Kelas") ? gradeObj.name : `Kelas ${gradeObj.name}`)
          : "-";
        const className = classObj?.name
          ? (classObj.name.startsWith("Kelas") || classObj.name.includes("-") ? classObj.name : `Kelas ${classObj.name}`)
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
          status: res.userDetail?.status || "Aktif",
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
    } catch {
      return mockDatabase.getStudents(params);
    }
  },

  getStudentDetail: async (id: string): Promise<{ data: StudentAdminItem }> => {
    try {
      const response = await api.get<any>(`/v1/student/${id}`);
      const res = response.data.data;

      const gradeObj = res.userDetail?.grade;
      const classObj = res.userDetail?.class;
      const gradeName = gradeObj?.name
        ? (gradeObj.name.startsWith("Tingkat") || gradeObj.name.startsWith("Kelas") ? gradeObj.name : `Kelas ${gradeObj.name}`)
        : "-";
      const className = classObj?.name
        ? (classObj.name.startsWith("Kelas") || classObj.name.includes("-") ? classObj.name : `Kelas ${classObj.name}`)
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
        status: res.userDetail?.status || "Aktif",
        academicHistory: res.academicHistory,
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
    } catch {
      const student = mockDatabase.getStudentById(id);
      return { data: student };
    }
  },

  createStudent: async (payload: CreateStudentAdminPayload) => {
    try {
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
    } catch {
      return mockDatabase.createStudent(payload);
    }
  },

  updateStudent: async (id: string, payload: UpdateStudentAdminPayload) => {
    try {
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
    } catch {
      return mockDatabase.updateStudent(id, payload);
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await api.delete(`/v1/student/${id}`);
      return response.data;
    } catch {
      mockDatabase.deleteStudent(id);
      return { statusCode: 200, message: "Berhasil menghapus data siswa" };
    }
  },

  // ===================== CLASS PROMOTION (KENAIKAN KELAS) =====================
  promoteStudents: async (payload: ClassPromotionPayload) => {
    try {
      const response = await api.post("/v1/academic/promote", payload);
      return response.data;
    } catch {
      return mockDatabase.promoteStudents(payload);
    }
  },
};
