import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROLE_ID } from "../constants";
import Loading from "../pages/Loading";

export const RootRedirect = () => {
  const { user, isLoadingUser, activeRole } = useAuth();

  if (isLoadingUser) return <Loading />;

  if (!user || !activeRole) return null;

  const currentRoleId = String(activeRole.id);

  if (currentRoleId === ROLE_ID.WALI_KELAS) {
    return <Navigate to="/admin" replace />;
  }

  if (currentRoleId === ROLE_ID.GURU_BK) {
    return <Navigate to="/admin-medis" replace />;
  }

  if (currentRoleId === ROLE_ID.SISWA) {
    return null;
  }

  return <Navigate to="/unauthorized" replace />;
};
