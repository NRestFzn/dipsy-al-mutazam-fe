import { Avatar, Dropdown, Layout, type MenuProps } from "antd";
import { ChevronDown, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAdminMedisProfile } from "../../hooks/useAdminMedis";
import { getImageUrl } from "../../utils/imageHelper";

const { Header } = Layout;

const items: MenuProps["items"] = [
  {
    key: "profile-key",
    label: "Lihat Profil Saya",
    icon: <User size={16} />,
  },
  {
    type: "divider",
  },
  {
    key: "logout-btn",
    danger: true,
    label: "Logout",
    icon: <RiLogoutCircleRLine className="w-5 h-5" />,
  },
];

interface ProfileComponentProps {
  role?: string | undefined;
  fullname?: string;
  profileUrl?: string;
  logout: () => void;
}

const ProfileComponent = (props: ProfileComponentProps) => {
  const { role, fullname, profileUrl, logout } = props;

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/masuk-admin");
  };

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout-btn") {
      handleLogout();
    } else if (e.key === "profile-key") {
      navigate(`/${role === "guru bk" || role === "admin medis" ? "admin-medis" : "admin"}/profile`);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown
        menu={{ items, onClick: onMenuClick }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 group">
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-gray-700 group-hover:text-[#00A651] transition-colors">
              {fullname || "Pengajar"}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {role || "Guru"}
            </div>
          </div>

          <Avatar
            size="large"
            src={profileUrl}
            className="bg-gray-200 text-gray-600 group-hover:bg-[#00A651] group-hover:text-white transition-colors"
          >
            {fullname?.charAt(0)?.toUpperCase() || <User />}
          </Avatar>

          <ChevronDown
            size={16}
            className="text-gray-400 group-hover:text-[#00A651] transition-colors"
          />
        </div>
      </Dropdown>
    </div>
  );
};

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  startAction: ReactNode;
}

function MainLayout(props: MainLayoutProps) {
  const { children, startAction } = props;

  const { logout, activeRole } = useAuth();
  const { data } = useAdminMedisProfile();

  const roleName = activeRole?.name?.toLowerCase();
  const fullname = data?.data?.fullname;
  const profileUrl = getImageUrl(data?.data?.profilePicture);

  return (
    <Layout className="h-screen w-screen overflow-hidden">
      <Header className="w-full !bg-white text-gray-800 flex justify-between items-center !px-4 !py-3 !md:p-[20px] !shadow-sm z-20 relative h-auto min-h-[64px] border-b border-gray-100">
        <section className="flex items-center gap-3">
          {startAction && <div>{startAction}</div>}

          <a
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
            href={`${roleName === "guru bk" || roleName === "admin medis" ? "/admin-medis/responden" : "/admin/responden"}`}
          >
            <img
              className="h-8 md:h-9 w-auto object-contain"
              src="/logo-al-multazam.png"
              alt="Logo SMAIT Al-Multazam"
            />
            <div className="hidden lg:block border-l border-slate-200 pl-3">
              <span className="text-xs text-slate-500 font-medium block leading-tight">
                Portal Guru & Pembimbing
              </span>
            </div>
          </a>
        </section>
        <ProfileComponent logout={logout} role={roleName} fullname={fullname} profileUrl={profileUrl} />
      </Header>
      <Layout className="h-full overflow-hidden">{children}</Layout>
    </Layout>
  );
}

export default MainLayout;
