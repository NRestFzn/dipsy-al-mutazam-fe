import type { LoginPayload, RegisterPayload, AuthResponse, UserMeResponse, LoginStudentPayload } from "../types/AuthTypes/authTypes";
import type { ResponseData } from "../types/commons";
import { api } from "./api";
import { mockDatabase } from "./mock/mockDatabase";

export const authService = {
	login: async (loginData: LoginPayload): Promise<ResponseData<AuthResponse>> => {
		try {
			const { data } = await api.post<ResponseData<AuthResponse>>("/v1/auth/signin", loginData);
			return data;
		} catch {
			return mockDatabase.loginAdmin(loginData.email, loginData.password);
		}
	},

	loginStudent: async (loginData: LoginStudentPayload): Promise<ResponseData<AuthResponse>> => {
		try {
			const { data } = await api.post<ResponseData<AuthResponse>>("/v1/auth/signin/student", loginData);
			return data;
		} catch {
			return mockDatabase.loginStudent(loginData.nisn, loginData.password);
		}
	},

	register: async (registerData: RegisterPayload): Promise<ResponseData<AuthResponse>> => {
		try {
			const { data } = await api.post<ResponseData<AuthResponse>>("/v1/auth/signup", registerData);
			return data;
		} catch {
			const newStd = mockDatabase.createStudent({
				fullname: registerData.fullname,
				nisn: registerData.nisn || registerData.nik || "0081234599",
				gender: registerData.gender,
				birthDate: registerData.birthDate,
				gradeLevelId: registerData.GradeId || "grade-x",
				classroomId: registerData.ClassId || "cls-x-a",
				phoneNumber: registerData.phoneNumber,
				password: registerData.password,
			});
			return mockDatabase.loginStudent(newStd.nisn, "almultazam123");
		}
	},

	getProfile: async (): Promise<ResponseData<UserMeResponse>> => {
		try {
			const { data } = await api.get<ResponseData<UserMeResponse>>("/v1/user/me");
			return data;
		} catch {
			const raw = localStorage.getItem("userData");
			if (raw) {
				const user = JSON.parse(raw);
				return {
					statusCode: 200,
					message: "Sukses mengambil profil",
					data: user,
				};
			}
			throw new Error("Sesi tidak ditemukan");
		}
	},
};
