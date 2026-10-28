import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Menu, ConfigProvider, type MenuProps } from "antd";
import {
    File,
    FileHeartIcon,
    GraduationCap,
    Database,
    Tags,
    UserCog,
    Users
} from "lucide-react";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export default function AdminSideBar({ responsiveSidebar }: { responsiveSidebar: boolean }) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const isAdminTU = pathname.startsWith("/admin-tu");
    const isAdminMedis = pathname.startsWith("/admin-medis");

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const itemsAdminDesa: MenuItem[] = [
        getItem('Responden', '/admin/responden', <FileHeartIcon size={20} />),
        getItem('Siswa Saya', '/admin/siswa-saya', <Users size={20} />),
    ];

    const itemsAdminTU: MenuItem[] = [
        getItem('Kelola Akademik', '/admin-tu/kelola-akademik', <GraduationCap size={20} />),
        getItem('Kelola Guru', '/admin-tu/kelola-guru', <UserCog size={20} />),
        getItem('Master Data', 'sub-master-data-tu', <Database size={20} />, [
            getItem('Kategori', '/admin-tu/master-data/category', <Tags size={18} />),
        ]),
        getItem('Kuisioner', '/admin-tu/kuisioner', <File size={20} />),
        getItem('Responden', '/admin-tu/responden', <FileHeartIcon size={20} />),
    ];

    const itemsAdminMedis: MenuItem[] = [
        getItem('Responden', '/admin-medis/responden', <FileHeartIcon size={20} />),
    ];

    const items = isAdminTU ? itemsAdminTU : isAdminMedis ? itemsAdminMedis : itemsAdminDesa;

    useEffect(() => {
        if (pathname.includes('/master-data')) {
            setOpenKeys(['sub-master-data-tu', 'sub-master-data']);
        }
    }, [pathname]);

    const getSelectedKey = () => {
        if (pathname === "/admin-tu" || pathname.startsWith("/admin-tu/kelola-akademik")) {
            return "/admin-tu/kelola-akademik";
        }
        if (pathname.startsWith("/admin-tu/kelola-guru")) {
            return "/admin-tu/kelola-guru";
        }
        if (pathname.startsWith("/admin-tu/master-data")) {
            return "/admin-tu/master-data/category";
        }
        if (pathname.startsWith("/admin-tu/kuisioner")) {
            return "/admin-tu/kuisioner";
        }
        if (pathname.startsWith("/admin-tu/responden")) {
            return "/admin-tu/responden";
        }
        if (pathname.startsWith("/admin-medis/responden")) {
            return "/admin-medis/responden";
        }
        if (pathname.startsWith("/admin/siswa-saya")) {
            return "/admin/siswa-saya";
        }
        if (pathname.startsWith("/admin/responden")) {
            return "/admin/responden";
        }
        return pathname;
    };

    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenKeys(keys);
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        itemSelectedBg: "#E8F7EF",
                        itemSelectedColor: "#00A651",
                        itemHoverBg: "#f9fafb",
                        itemHoverColor: "#00A651",
                        itemColor: "#52525b",
                        iconSize: 20,
                    },
                },
            }}
        >
            <Menu
                mode="inline"
                selectedKeys={[getSelectedKey()]}

                openKeys={openKeys}
                onOpenChange={onOpenChange}

                inlineCollapsed={responsiveSidebar}

                style={{
                    borderRight: 0,
                    background: 'transparent',
                    fontSize: '15px',
                    fontWeight: 500,
                    margin: 0
                }}
                items={items}
                onClick={onClick}
            />
        </ConfigProvider>
    );
}
