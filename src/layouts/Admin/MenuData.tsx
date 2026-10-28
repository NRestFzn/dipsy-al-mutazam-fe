import { Database, File, FileHeartIcon, GraduationCap, Tags, UserCog } from "lucide-react";

interface SidebarItemProps {
    key: string;
    label: string;
    path: string;
    icon: React.ElementType;
    children?: SidebarItemProps[];
}

export const ADMIN_DESA_MENU: SidebarItemProps[] = [
    {
        key: 'responden',
        label: "Responden",
        path: "/admin/responden",
        icon: FileHeartIcon,
    },
    {
        key: 'siswa-saya',
        label: "Siswa Saya",
        path: "/admin/siswa-saya",
        icon: GraduationCap,
    },
];

export const ADMIN_TU_MENU: SidebarItemProps[] = [
    {
        key: 'akademik',
        label: "Kelola Akademik",
        path: "/admin-tu/kelola-akademik",
        icon: GraduationCap,
    },
    {
        key: 'guru',
        label: "Kelola Guru",
        path: "/admin-tu/kelola-guru",
        icon: UserCog,
    },
    {
        key: 'master-data',
        label: "Master Data",
        path: "#",
        icon: Database,
        children: [
            {
                key: 'kategori',
                label: "Kategori",
                path: "/admin-tu/master-data/category",
                icon: Tags,
            },
        ],
    },
    {
        key: 'kuisioner',
        label: "Kuisioner",
        path: "/admin-tu/kuisioner",
        icon: File,
    },
    {
        key: 'responden',
        label: "Responden",
        path: "/admin-tu/responden",
        icon: FileHeartIcon,
    },
];

export const ADMIN_MEDIS_MENU: SidebarItemProps[] = [
    {
        key: 'responden',
        label: "Responden",
        path: "/admin-medis/responden",
        icon: FileHeartIcon,
    },
];
