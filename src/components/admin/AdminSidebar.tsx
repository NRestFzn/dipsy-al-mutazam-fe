import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Menu, ConfigProvider, type MenuProps } from "antd";
import {
    File,
    FileHeartIcon,
    GraduationCap,
    Database,
    Tags,
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

    const isAdminMedis = pathname.startsWith("/admin-medis");

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const itemsWaliKelas: MenuItem[] = [
        getItem('Responden', '/admin/responden', <FileHeartIcon size={20} />),
        getItem('Kelola Akademik', '/admin/kelola-akademik', <GraduationCap size={20} />),
    ];

    const itemsGuruBK: MenuItem[] = [
        getItem('Responden', '/admin-medis/responden', <FileHeartIcon size={20} />),
        getItem('Kuisioner', '/admin-medis/kuisioner', <File size={20} />),
        getItem('Master Data', 'sub-master-data', <Database size={20} />, [
            getItem('Kategori', '/admin-medis/master-data/category', <Tags size={18} />),
        ]),
    ];

    const items = isAdminMedis ? itemsGuruBK : itemsWaliKelas;

    useEffect(() => {
        if (pathname.includes('/master-data')) {
            setOpenKeys(['sub-master-data']);
        }
    }, [pathname]);

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
                        itemSelectedBg: "#e6f6ee",
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
                selectedKeys={[pathname]}
                openKeys={openKeys}
                onOpenChange={onOpenChange as any}
                inlineCollapsed={responsiveSidebar}
                style={{
                    borderRight: 0,
                    background: 'transparent',
                    fontSize: '15px',
                    fontWeight: 500,
                }}
                items={items}
                onClick={onClick}
            />
        </ConfigProvider>
    );
}
