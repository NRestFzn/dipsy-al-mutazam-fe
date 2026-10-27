import { Button, Tag } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { getQuestionnaireResultLabel } from "../../../../utils/questionnaireDisplay";

export interface SubmissionRow {
    submissionId: string;
    submissionDate: string;
    trueCount: string;
    score?: number;
    resultLabel?: string;
    isMentalUnStable: number;
}

interface SubmissionColumnProps {
    onViewDetail: (submissionId: string) => void;
}

export const getSubmissionsColumns = ({ 
    onViewDetail 
}: SubmissionColumnProps): ColumnsType<SubmissionRow> => [
    {
        title: 'No',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Tanggal Pengisian',
        dataIndex: 'submissionDate',
        key: 'submissionDate',
        render: (date) => (
            <div className="flex flex-col">
                <span className="font-medium text-gray-700">
                    {new Date(date).toLocaleDateString("id-ID", { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                </span>
                <span className="text-xs text-gray-400">
                    {new Date(date).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
            </div>
        ),
    },
    {
        title: 'Skor Total (SDQ/SRQ)',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        render: (score, record) => (
            <span className="font-bold text-gray-800">
                {score ?? record.trueCount ?? "-"}
            </span>
        ),
    },
    {
        title: 'Status Skrining',
        dataIndex: 'isMentalUnStable',
        key: 'isMentalUnStable',
        align: 'center',
        render: (isUnstable: number, record) => {
            const color = isUnstable === 1 ? "error" : "success";
            const text = getQuestionnaireResultLabel(
                record.resultLabel || (isUnstable === 1 ? "Butuh Perhatian" : "Normal / Stabil")
            );

            return (
                <Tag color={color} className="font-medium px-2 py-0.5 rounded-full">
                    {text}
                </Tag>
            );
        },
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 140,
        render: (_, record) => (
            <Button
                type="primary"
                size="small"
                className="!bg-[#00A651] hover:!bg-[#009245] flex items-center gap-1.5 mx-auto"
                onClick={() => onViewDetail(record.submissionId)}
            >
                <Eye size={14} />
                Detail Jawaban
            </Button>
        ),
    },
];

