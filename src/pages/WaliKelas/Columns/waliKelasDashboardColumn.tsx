import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface WaliKelasStudentDataRow {
    UserId: string;
    fullname: string;
    nisn?: string;
    nik?: string;
    isMentalUnStable: boolean;
    lastSubmissionDate: string;
}

export const getWaliKelasDashboardColumn = (): ColumnsType<WaliKelasStudentDataRow> => [
    {
        title: 'No',
        key: 'index',
        width: 60,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama Siswa',
        dataIndex: 'fullname',
        key: 'fullname',
        render: (text, record) => (
            <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{text}</span>
                {record.nisn && (
                    <span className="text-xs text-gray-400">NISN: {record.nisn}</span>
                )}
            </div>
        ),
    },
    {
        title: 'Status Skrining',
        dataIndex: 'isMentalUnStable',
        key: 'isMentalUnStable',
        align: 'center',
        render: (condition) => {
            const isRisk = Boolean(condition);
            return (
                <Tag color={isRisk ? "error" : "success"} className="m-0 font-medium px-2 py-0.5 rounded-full">
                    {isRisk ? "Butuh Perhatian" : "Normal / Stabil"}
                </Tag>
            );
        },
    },
    {
        title: 'Terakhir Mengisi',
        dataIndex: 'lastSubmissionDate',
        key: 'lastSubmissionDate',
        render: (date) => {
            if (!date) return <span className="text-gray-400 italic">Belum mengisi</span>;
            return (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-700">
                        {new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="text-gray-400 text-xs">
                        {new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </span>
                </div>
            );
        },
    },
];

