import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { academicService } from "../../service/Admin/academicService";
import type {
  CreateClassPayload,
  CreateStudentAdminPayload,
  GetClassesParams,
  GetGradesParams,
  GetStudentsAdminParams,
  GraduateStudentsPayload,
  PromoteStudentsPayload,
  UpdateClassPayload,
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

  // ===================== CLASS HOOKS =====================
  const useClasses = (params?: GetClassesParams) => {
    return useQuery({
      queryKey: ["academic", "classes", params],
      queryFn: () => academicService.getClasses(params),
      placeholderData: keepPreviousData,
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

  const useStudentAcademicHistory = (id: string | null) => {
    return useQuery({
      queryKey: ["academic", "student-history", id],
      queryFn: () => academicService.getAcademicHistory(id!),
      enabled: Boolean(id),
    });
  };

  const promoteStudentsMutation = useMutation({
    mutationFn: (payload: PromoteStudentsPayload) => academicService.promoteStudents(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
    },
  });

  const graduateStudentsMutation = useMutation({
    mutationFn: (payload: GraduateStudentsPayload) => academicService.graduateStudents(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
    },
  });

  return {
    useGrades,

    useClasses,
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,

    useStudentsAdmin,
    useStudentDetail,
    useStudentAcademicHistory,
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
    promoteStudentsMutation,
    graduateStudentsMutation,
  };
};
