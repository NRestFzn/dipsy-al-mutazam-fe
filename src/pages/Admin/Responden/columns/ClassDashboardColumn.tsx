import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChevronRight } from "lucide-react";
import type { ClassData } from "../../../../types/adminMedisService";

interface ClassDashboardColumnProps {
    onSeeDetail: (classId: string) => void;
}

export const getClassDashboardColumns = ({
    onSeeDetail,
}: ClassDashboardColumnProps): ColumnsType<ClassData> => [
    {
        title: "No",
        key: "index",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Nama Kelas",
        key: "className",
        sorter: (a, b) =>
            String(a.className || "").localeCompare(String(b.className || "")),
        render: (_, record) => {
            const rawName = record.className ?? record.rtName ?? "";
            const displayName = String(rawName).startsWith("Kelas") || String(rawName).includes("-")
                ? String(rawName)
                : `Kelas ${rawName}`;
            return <span className="font-semibold text-gray-800">{displayName}</span>;
        },
    },
    {
        title: "Total Siswa",
        dataIndex: "userCount",
        key: "userCount",
        sorter: (a, b) => (a.userCount || 0) - (b.userCount || 0),
        align: "center",
        render: (count, record) => count ?? record.studentCount ?? 0,
    },
    {
        title: "Siswa Mengisi",
        dataIndex: "submitCount",
        key: "submitCount",
        sorter: (a, b) => (a.submitCount || 0) - (b.submitCount || 0),
        align: "center",
        render: (count) => (
            <span className="font-semibold text-gray-700">{count}</span>
        ),
    },
    {
        title: "Indikasi Butuh Perhatian",
        dataIndex: "unStableMentalPercentage",
        key: "unStableMentalPercentage",
        sorter: (a, b) =>
            (a.unStableMentalPercentage || 0) -
            (b.unStableMentalPercentage || 0),
        align: "center",
        render: (percentage: number) => {
            const value = percentage || 0;

            const colorClass =
                value >= 50
                    ? "text-red-600"
                    : value >= 25
                    ? "text-amber-600"
                    : "text-emerald-600";

            return (
                <span className={`font-semibold ${colorClass}`}>{value}%</span>
            );
        },
    },
    {
        title: "Aksi",
        key: "action",
        align: "center",
        width: 140,
        render: (_, record) => {
            const classId = record.classId ?? record.rtId;
            return (
                <Button
                    type="primary"
                    size="small"
                    className="!bg-[#00A651] hover:!bg-[#009245] flex items-center gap-1 mx-auto"
                    onClick={() => onSeeDetail(classId)}
                >
                    Lihat Siswa
                    <ChevronRight size={14} />
                </Button>
            );
        },
    },
];

