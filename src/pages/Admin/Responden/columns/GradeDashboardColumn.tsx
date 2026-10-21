import { Button, Tag } from "antd";
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
        title: "Tingkat / Jenjang",
        key: "gradeName",
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
        align: "center",
        render: (count, record) => count ?? record.rtCount ?? 0,
    },
    {
        title: "Total Siswa",
        dataIndex: "userCount",
        key: "userCount",
        align: "center",
        render: (count, record) => count ?? record.studentCount ?? 0,
    },
    {
        title: "Siswa Mengisi",
        dataIndex: "submitCount",
        key: "submitCount",
        align: "center",
        render: (count) => (
            <span className="font-semibold text-gray-700">{count}</span>
        ),
    },
    {
        title: "Indikasi Butuh Perhatian",
        dataIndex: "unStableMentalPercentage",
        key: "unStableMentalPercentage",
        align: "center",
        render: (percentage: number) => {
            let color = "success";
            let label = "Rendah";

            if (percentage >= 50) {
                color = "error";
                label = "Tinggi";
            } else if (percentage >= 25) {
                color = "warning";
                label = "Sedang";
            }

            return (
                <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-gray-800">{percentage || 0}%</span>
                    <Tag color={color} className="m-0 min-w-[65px] text-center font-medium rounded-full">
                        {label}
                    </Tag>
                </div>
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

