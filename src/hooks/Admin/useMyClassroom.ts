import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { academicService } from "../../service/Admin/academicService";

/**
 * Kelas binaan untuk wali kelas: pakai ClassId dari profil bila ada,
 * kalau tidak cari kelas yang homeroomTeacherId-nya adalah user ini.
 */
export const useMyClassroom = () => {
  const { user } = useAuth();

  const ownClassId = user?.userDetail?.ClassId ?? undefined;
  const ownClassName = user?.userDetail?.class?.name ?? undefined;

  const { data } = useQuery({
    queryKey: ["my-classroom", user?.id],
    queryFn: () => academicService.getClasses({ pageSize: 100 }),
    enabled: Boolean(user?.id) && !ownClassId,
    staleTime: 1000 * 60 * 5,
  });

  const homeroom = data?.data?.find(
    (item) => item.homeroomTeacherId === user?.id
  );

  return {
    classId: ownClassId ?? homeroom?.id ?? "",
    className: ownClassName ?? homeroom?.name ?? "Kelas Binaan",
  };
};
