import { Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import type { Questionnaire } from "../../../types/Questionnaire/questionnaireTypes";

interface WaliKelasHistoryColumnsProps {
    onDetail: (id: string) => void;
    pagination: { page: number; pageSize: number };
}

export const getWaliKelasHistoryColumn = ({
    onDetail,
    pagination,
}: WaliKelasHistoryColumnsProps): ColumnsType<Questionnaire> => [
    {
        title: "No",
        width: 60,
        align: "center",
        render: (_, __, index) =>
            (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    {
        title: "Judul Kuesioner",
        dataIndex: "title",
        key: "title",
        render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
        title: "Kategori",
        dataIndex: ["category", "name"],
        key: "category",
        render: (category) => (
            category ? (
                <Tag color="cyan" className="rounded-full px-3 font-medium">
                    {category}
                </Tag>
            ) : (
                <span className="text-gray-400">-</span>
            )
        ),
    },
    {
        title: "Tanggal Rilis",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (
            <span className="text-gray-600 text-sm">
                {dayjs(date).format("DD MMM YYYY, HH:mm")}
            </span>
        ),
    },
    {
        title: "Aksi",
        key: "action",
        align: "center",
        width: 140,
        render: (_, record) => (
            <Button
                type="primary"
                size="small"
                className="!bg-[#00A651] hover:!bg-[#009245] flex items-center gap-1.5 mx-auto"
                onClick={() => onDetail(record.id)}
            >
                <Eye size={15} />
                Hasil Kelas
            </Button>
        ),
    },
];

