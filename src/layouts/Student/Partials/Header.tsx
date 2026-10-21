import { Avatar, Dropdown, Tag, type MenuProps } from "antd";
import { ChevronDown, LogOut, SwitchCamera, User } from "lucide-react";
import type { Role, UserMeResponse } from "../../../types/AuthTypes/authTypes";
import { ROLE_ID } from "../../../constants";
import { useNavigate } from "react-router";

interface HeaderProps {
  fullname: string;
  profileUrl?: string;
  onLogout: () => void;
  activeRole: Role;
  switchRole: (role: Role) => void;
  user: UserMeResponse;
}

export const HomeHeader = ({ fullname, onLogout, profileUrl, activeRole, user }: HeaderProps) => {
  const navigate = useNavigate();

  const getRoleLabel = () => {
    if (activeRole?.id === ROLE_ID.GURU_BK) return "Guru BK";
    if (activeRole?.id === ROLE_ID.WALI_KELAS) return "Wali Kelas";
    if (activeRole?.id === ROLE_ID.SISWA) return "Siswa";
    return "Pengguna";
  };

  const getRoleColor = () => {
    if (activeRole?.id === ROLE_ID.GURU_BK) return "blue";
    if (activeRole?.id === ROLE_ID.WALI_KELAS) return "gold";
    return "green";
  };

  const items: MenuProps["items"] = [
    {
      key: "role-info",
      label: (
        <div className="flex flex-col px-1 py-1 cursor-default">
          <span className="text-[11px] text-slate-400 font-medium">Masuk sebagai</span>
          <Tag color={getRoleColor()} className="!mt-1 !w-fit !border-none !px-2 !py-0.5 !font-semibold !text-xs">
            {getRoleLabel()}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      label: <span className="text-slate-700 font-medium">Profil Saya</span>,
      icon: <User size={15} className="text-slate-500" />,
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    ...(user?.roles && user.roles.length > 1
      ? [
          {
            key: "switch-role",
            label: <span className="text-slate-700 font-medium">Ganti Peran</span>,
            icon: <SwitchCamera size={15} className="text-slate-500" />,
            onClick: () => navigate("/pilih-peran"),
          },
          { type: "divider" } as any,
        ]
      : []),
    {
      key: "logout",
      label: <span className="text-rose-600 font-medium">Keluar</span>,
      icon: <LogOut size={15} className="text-rose-500" />,
      onClick: onLogout,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            className="h-9 w-auto object-contain"
            src="/logo-al-multazam.png"
            alt="Logo SMAIT Al-Multazam"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="text-xs text-slate-500 font-medium block leading-tight">
              Portal Konseling & Skrining
            </span>
          </div>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center gap-3">
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <button
              type="button"
              className="flex items-center gap-3 p-1.5 pl-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-left focus:outline-none"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[140px] truncate">
                  {fullname}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {getRoleLabel()}
                </span>
              </div>

              <Avatar
                src={profileUrl}
                icon={!profileUrl && <User size={16} />}
                className="bg-emerald-100 text-[#00A651] border border-emerald-200 shrink-0 font-bold"
                size={32}
              >
                {!profileUrl && fullname ? fullname.charAt(0).toUpperCase() : ""}
              </Avatar>

              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
