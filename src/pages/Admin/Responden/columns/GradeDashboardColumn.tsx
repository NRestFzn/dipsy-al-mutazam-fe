import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChevronRight } from "lucide-react";
import type { GradeSectionData } from "../../../../types/adminMedisService";

interface GradeDashboardColumnProps {
    onSeeDetail: (gradeId: string) => void;
}

export const getGradeDashboardColumn = ({
    onSeeDetail,
}: GradeDashboardColumnProps): ColumnsType<GradeSectionData> => [
    {
        title: "No",
        key: "index",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Tingkat / Jenjang",
        key: "gradeName",
        sorter: (a, b) =>
            String(a.gradeName || "").localeCompare(String(b.gradeName || "")),
        render: (_, record) => {
            const rawName = record.gradeName ?? record.rwName ?? record.name ?? "";
            const displayName = String(rawName).startsWith("Tingkat") || String(rawName).startsWith("Kelas")
                ? String(rawName)
                : `Tingkat ${rawName}`;
            return <span className="font-semibold text-gray-800">{displayName}</span>;
        },
    },
    {
        title: "Jumlah Kelas",
        dataIndex: "classCount",
        key: "classCount",
        sorter: (a, b) => (a.classCount || 0) - (b.classCount || 0),
        align: "center",
        render: (count, record) => count ?? record.rtCount ?? 0,
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
            const gradeId = record.gradeId ?? record.rwId ?? record.id;
            return (
                <Button
                    type="primary"
                    size="small"
                    className="!bg-[#00A651] hover:!bg-[#009245] flex items-center gap-1 mx-auto"
                    onClick={() => onSeeDetail(gradeId)}
                >
                    Lihat Kelas
                    <ChevronRight size={14} />
                </Button>
            );
        },
    },
];

