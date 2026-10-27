import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { academicService } from "../../service/Admin/academicService";
import type {
  ClassPromotionPayload,
  CreateClassPayload,
  CreateGradePayload,
  CreateStudentAdminPayload,
  GetClassesParams,
  GetGradesParams,
  GetStudentsAdminParams,
  UpdateClassPayload,
  UpdateGradePayload,
  UpdateStudentAdminPayload,
} from "../../types/Academic/academicTypes";

export const useAcademic = () => {
  const queryClient = useQueryClient();

  // ===================== GRADE HOOKS =====================
  const useGrades = (params?: GetGradesParams) => {
    return useQuery({
      queryKey: ["academic", "grades", params],
      queryFn: () => academicService.getGrades(params),
      placeholderData: keepPreviousData,
    });
  };

  const createGradeMutation = useMutation({
    mutationFn: (payload: CreateGradePayload) => academicService.createGrade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  const updateGradeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGradePayload }) =>
      academicService.updateGrade(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: (id: string) => academicService.deleteGrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  // ===================== CLASS HOOKS =====================
  const useClasses = (params?: GetClassesParams) => {
    return useQuery({
      queryKey: ["academic", "classes", params],
      queryFn: () => academicService.getClasses(params),
      placeholderData: keepPreviousData,
      enabled: !params?.gradeId && !params?.RukunWargaId ? true : Boolean(params?.gradeId || params?.RukunWargaId),
    });
  };

  const createClassMutation = useMutation({
    mutationFn: (payload: CreateClassPayload) => academicService.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClassPayload }) =>
      academicService.updateClass(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => academicService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  // ===================== STUDENT HOOKS =====================
  const useStudentsAdmin = (params?: GetStudentsAdminParams) => {
    return useQuery({
      queryKey: ["academic", "students", params],
      queryFn: () => academicService.getStudents(params),
      placeholderData: keepPreviousData,
    });
  };

  const useStudentDetail = (id: string | null) => {
    return useQuery({
      queryKey: ["academic", "student", id],
      queryFn: () => academicService.getStudentDetail(id!),
      enabled: Boolean(id),
    });
  };

  const createStudentMutation = useMutation({
    mutationFn: (payload: CreateStudentAdminPayload) => academicService.createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentAdminPayload }) =>
      academicService.updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => academicService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
    },
  });

  const promoteStudentsMutation = useMutation({
    mutationFn: (payload: ClassPromotionPayload) => academicService.promoteStudents(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
    },
  });

  return {
    useGrades,
    createGradeMutation,
    updateGradeMutation,
    deleteGradeMutation,

    useClasses,
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,

    useStudentsAdmin,
    useStudentDetail,
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
    promoteStudentsMutation,
  };
};
