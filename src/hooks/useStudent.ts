import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../service/studentService";
import { message } from "antd";
import type { UpdateProfileStudentPayload } from "../types/Student/studentType";

export const useStudent = () => {
  return useQuery({
    queryKey: ["student", "me"],
    queryFn: studentService.getStudentProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useInfiniteStudents = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["students", "list", search],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return await studentService.getAllStudents({
        page: pageParam as number,
        pageSize: 10,
        fullname: search,
      });
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta?.pagination;

      if (!meta) return undefined;

      if (meta.page < meta.pageCount) {
        return meta.page + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileStudentPayload) => studentService.updateProfile(payload),
    onSuccess: () => {
      message.success("Profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["student", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => studentService.updateProfilePicture(file),
    onSuccess: () => {
      message.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["student", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal mengupload foto");
    },
  });
};