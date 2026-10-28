import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { isGuruBkRole, isSiswaRole, isTuRole, isWaliKelasRole } from "../constants";
import Loading from "../pages/Loading";

export const RootRedirect = () => {
  const { user, isLoadingUser, activeRole } = useAuth();

  if (isLoadingUser) return <Loading />;

  if (!user || !activeRole) return null;

  if (isTuRole(activeRole)) {
    return <Navigate to="/admin-tu" replace />;
  }

  if (isWaliKelasRole(activeRole)) {
    return <Navigate to="/admin" replace />;
  }

  if (isGuruBkRole(activeRole)) {
    return <Navigate to="/admin-medis" replace />;
  }

  if (isSiswaRole(activeRole)) {
    return null;
  }

  return <Navigate to="/unauthorized" replace />;
};
