import { useQuery } from "@tanstack/react-query";
import { academicYearService } from "../../service/Admin/academicYearService";
import { getCurrentAcademicYear } from "../../utils/academicYear";

/**
 * Tahun ajaran aktif dari server (data-driven), dengan fallback ke kalender
 * bila endpoint belum tersedia atau gagal.
 */
export const useCurrentAcademicYear = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["academic-year", "current"],
    queryFn: () => academicYearService.getCurrent(),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    academicYear: data || getCurrentAcademicYear(),
    isFromServer: Boolean(data),
    isLoading,
  };
};
