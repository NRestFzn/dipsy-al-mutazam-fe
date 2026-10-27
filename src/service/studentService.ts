import type { ResponseData } from "../types/commons";
import type { GetResidentsParams, StudentMe, UpdateProfileStudentPayload } from "../types/Student/studentType";
import { api } from "./api";
import { mockDatabase } from "./mock/mockDatabase";

export const studentService = {
  getAllStudents: async (params: GetResidentsParams) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== "")
      );

      const response = await api.get("/v1/student", { params: cleanParams });
      return response.data;
    } catch {
      return mockDatabase.getStudents(params as any);
    }
  },

  getStudentProfile: async () => {
    try {
      const response = await api.get<ResponseData<StudentMe>>("/v1/student/me");
      return response.data;
    } catch {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const u = JSON.parse(raw);
        try {
          const s = mockDatabase.getStudentById(u.id);
          return {
            statusCode: 200,
            message: "Sukses mengambil profil (Mock)",
            data: {
              ...u,
              fullname: s.fullname,
              email: s.email || u.email,
              userDetail: {
                ...u.userDetail,
                ...s,
                grade: s.gradeLevel,
                class: s.classroom,
                status: s.status,
                academicHistory: s.academicHistory,
              },
            },
          };
        } catch {
          return {
            statusCode: 200,
            message: "Sukses mengambil profil",
            data: u,
          };
        }
      }
      throw new Error("Profil tidak ditemukan");
    }
  },

  updateProfile: async (payload: UpdateProfileStudentPayload) => {
    try {
      const response = await api.put("/v1/student/me", payload);
      return response.data;
    } catch {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const u = JSON.parse(raw);
        u.userDetail = { ...u.userDetail, phoneNumber: payload.phoneNumber };
        localStorage.setItem("userData", JSON.stringify(u));
        try {
          mockDatabase.updateStudent(u.id, {
            fullname: u.fullname,
            nisn: u.nisn || u.userDetail?.nisn,
            gender: u.userDetail?.gender,
            birthDate: u.userDetail?.birthDate,
            gradeLevelId: u.userDetail?.gradeLevelId,
            classroomId: u.userDetail?.classroomId,
            phoneNumber: payload.phoneNumber,
          });
        } catch {
          // ignore
        }
      }
      return { statusCode: 200, message: "Profil berhasil diperbarui" };
    }
  },

  updateProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await api.put("/v1/user/update/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
