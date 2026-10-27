import axios from "axios";
import type {
	AdminProfile,
	ApiResponse,
	QuestionnaireByIdResponse,
	UpdateAdminProfilePayload,
} from "../types/adminDesaService";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const getAuthToken = (): string | null => {
	return localStorage.getItem("authToken");
};

const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const adminDesaService = {
	getMe: async () => {
		const response = await api.get<ApiResponse<AdminProfile>>("/v1/user/me");
		return response.data;
	},

	updateProfile: async (payload: UpdateAdminProfilePayload) => {
		const response = await api.put("/v1/user/me", payload);
		return response.data;
	},

	async getMedisQuestionnaireById(
		questionnaireId: string
	): Promise<QuestionnaireByIdResponse> {
		const response = await api.get<QuestionnaireByIdResponse>(
			`/v1/questionnaire/${questionnaireId}`
		);
		return response.data;
	},

	async updateProfilePicture(file: File) {
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
