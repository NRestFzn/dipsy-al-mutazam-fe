import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { academicService } from "../../service/Admin/academicService";
import type { ClassItem } from "../../types/Academic/academicTypes";

/**
 * Kelas binaan untuk wali kelas pada tahun ajaran berjalan.
 * Satu guru boleh memegang lebih dari satu kelas, sehingga hasilnya berupa daftar.
 */
export const useMyClassroom = () => {
  const { user } = useAuth();

  const ownClassId = user?.userDetail?.ClassId ?? undefined;
  const ownClassName = user?.userDetail?.class?.name ?? undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["my-classroom", user?.id],
    queryFn: () => academicService.getClasses({ pageSize: 100 }),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 60 * 5,
  });

  const classes: ClassItem[] = (data?.data || []).filter(
    (item) => item.homeroomTeacherId === user?.id
  );

  const primary = ownClassId
    ? { id: ownClassId, name: ownClassName ?? "Kelas Binaan" }
    : classes[0];

  return {
    classes,
    hasMultipleClasses: classes.length > 1,
    classId: primary?.id ?? "",
    className: primary?.name ?? "Kelas Binaan",
    isLoading,
  };
};
