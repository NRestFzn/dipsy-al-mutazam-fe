import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { isGuruBkRole, isSiswaRole, isTuRole, isWaliKelasRole, ROLE_ID } from "../constants";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoleIds: string[];
  loginPath?: string;
}

export const RoleGuard = ({ children, allowedRoleIds, loginPath = "/masuk" }: RoleGuardProps) => {
  const { user, activeRole, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Spin
            indicator={
              <Loader2 className="animate-spin text-[#00A651]" size={40} />
            }
          />
          <span className="text-gray-500 font-medium">
            Memverifikasi akses...
          </span>
        </div>
      </div>
    );
  }

  if (!user || !activeRole) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  const currentRoleId = String(activeRole.id || "").toLowerCase();
  const currentRoleName = String(activeRole.name || "").toLowerCase();

  const isAllowed = allowedRoleIds.some((allowed) => {
    const norm = String(allowed).toLowerCase();
    if (norm === currentRoleId || norm === currentRoleName) return true;
    if ((norm === ROLE_ID.TU.toLowerCase() || norm === "tu") && isTuRole(activeRole)) return true;
    if ((norm === ROLE_ID.GURU_BK.toLowerCase() || norm === "gurubk") && isGuruBkRole(activeRole)) return true;
    if ((norm === ROLE_ID.WALI_KELAS.toLowerCase() || norm === "walikelas") && isWaliKelasRole(activeRole)) return true;
    if ((norm === ROLE_ID.SISWA.toLowerCase() || norm === "siswa") && isSiswaRole(activeRole)) return true;
    return false;
  });

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
