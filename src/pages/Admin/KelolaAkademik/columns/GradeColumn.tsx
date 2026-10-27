import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { GradeItem } from "../../../../types/Academic/academicTypes";

interface GradeColumnProps {
  pagination: { page: number; pageSize: number };
}

export const getGradeColumns = ({
  pagination,
}: GradeColumnProps): ColumnsType<GradeItem> => [
  {
    title: "No",
    key: "index",
    width: 65,
    align: "center",
    render: (_, __, index) =>
      (pagination.page - 1) * pagination.pageSize + index + 1,
  },
  {
    title: "Tingkat / Jenjang",
    dataIndex: "name",
    key: "name",
    sorter: true,
    render: (name: string) => (
      <span className="font-semibold text-slate-900">{name}</span>
    ),
  },
  {
    title: "Jenjang",
    dataIndex: "level",
    key: "level",
    width: 120,
    align: "center",
    render: (level?: string | null) =>
      level ? (
        <Tag color={level === "SMA" ? "purple" : "blue"} className="!rounded-md px-2.5">
          {level}
        </Tag>
      ) : (
        <span className="text-slate-400">-</span>
      ),
  },
  {
    title: "Jumlah Kelas",
    dataIndex: "classCount",
    key: "classCount",
    align: "center",
    width: 140,
    render: (count: number) => (
      <Tag color="blue" className="font-medium !rounded-md px-2.5">
        {count || 0} Kelas
      </Tag>
    ),
  },
  {
    title: "Jumlah Siswa",
    dataIndex: "studentCount",
    key: "studentCount",
    align: "center",
    width: 140,
    render: (count: number) => (
      <Tag
        color="emerald"
        className="font-medium !rounded-md px-2.5 text-emerald-700 bg-emerald-50 border-emerald-200"
      >
        {count || 0} Siswa
      </Tag>
    ),
  },
];
