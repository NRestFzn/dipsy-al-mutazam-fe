import { Avatar, Dropdown, Tag, type MenuProps } from "antd";
import { ChevronDown, LogOut, User } from "lucide-react";
import type { Role, UserMeResponse } from "../../../types/AuthTypes/authTypes";
import { isGuruBkRole, isTuRole, isWaliKelasRole } from "../../../constants";
import { useNavigate } from "react-router";

interface HeaderProps {
  fullname: string;
  profileUrl?: string;
  onLogout: () => void;
  activeRole: Role;
  user: UserMeResponse;
}

export const HomeHeader = ({
  fullname,
  onLogout,
  profileUrl,
  activeRole,
}: HeaderProps) => {
  const navigate = useNavigate();

  const getRoleLabel = () => {
    if (isTuRole(activeRole)) return "Tata Usaha";
    if (isGuruBkRole(activeRole)) return "Guru BK";
    if (isWaliKelasRole(activeRole)) return "Wali Kelas";
    return "Siswa";
  };

  const items: MenuProps["items"] = [
    {
      key: "role-info",
      label: (
        <div className="flex flex-col px-1 py-1 cursor-default">
          <span className="text-xs text-gray-400 font-medium">Masuk sebagai</span>
          <Tag color="green" className="!mt-1 !w-fit !border-none !px-2 !py-0.5 !font-semibold">
            {getRoleLabel()}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    {
      key: "profile",
      label: "Lihat Profil Saya",
      icon: <User size={16} />,
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <span className="text-red-600 font-medium">Logout</span>,
      icon: <LogOut size={16} className="text-red-500" />,
      onClick: onLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-99">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="h-9 w-auto object-contain"
            src="/logo-al-multazam.png"
            alt="Logo SMAIT Al-Multazam"
          />
        </div>

        <div className="flex items-center gap-4">
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight" arrow>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 transition-colors">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-700 leading-tight">
                  {fullname}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                  {getRoleLabel()}
                </span>
              </div>

              <Avatar
                src={profileUrl}
                icon={!profileUrl && <User size={20} />}
                className="flex-shrink-0 border-2 bg-green-100 text-green-600 border-green-200"
                size={40}
              />

              <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
