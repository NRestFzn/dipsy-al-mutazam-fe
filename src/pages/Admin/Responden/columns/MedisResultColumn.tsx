import type { ColumnsType } from "antd/es/table";

export interface QuestionResult {
    no: number;
    question: string;
    answer: string;
}

export const getMedisResultColumns = (): ColumnsType<QuestionResult> => [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 60,
        align: 'center',
    },
    {
        title: 'Pertanyaan',
        dataIndex: 'question',
        key: 'question',
        render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
        title: 'Jawaban Siswa',
        dataIndex: 'answer',
        key: 'answer',
        width: 220,
        render: (text) => (
            <span className="font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 inline-block text-xs">
                {text}
            </span>
        ),
    },
];

