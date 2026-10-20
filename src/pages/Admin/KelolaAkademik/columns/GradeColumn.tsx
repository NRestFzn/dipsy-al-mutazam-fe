import { Button, Tooltip, Tag } from "antd";
import { Edit2, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { GradeItem } from "../../../../types/Academic/academicTypes";

interface GradeColumnProps {
  pagination: { page: number; pageSize: number };
  onEdit?: (record: GradeItem) => void;
  onDelete: (record: GradeItem) => void;
}

export const getGradeColumns = ({
  pagination,
  onEdit,
  onDelete,
}: GradeColumnProps): ColumnsType<GradeItem> => [
  {
    title: "No",
    key: "index",
    width: 65,
    align: "center",
    render: (_, __, index) => (pagination.page - 1) * pagination.pageSize + index + 1,
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
      <Tag color="emerald" className="font-medium !rounded-md px-2.5 text-emerald-700 bg-emerald-50 border-emerald-200">
        {count || 0} Siswa
      </Tag>
    ),
  },
  {
    title: "Aksi",
    key: "action",
    align: "center",
    width: 110,
    render: (_, record) => (
      <div className="flex items-center justify-center gap-1.5">
        {onEdit && (
          <Tooltip title="Ubah Nama Tingkat">
            <Button
              type="text"
              size="small"
              icon={<Edit2 size={15} className="text-slate-600 hover:text-emerald-600" />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        )}
        <Tooltip title="Hapus Tingkat">
          <Button
            type="text"
            danger
            size="small"
            icon={<Trash2 size={15} />}
            onClick={() => onDelete(record)}
          />
        </Tooltip>
      </div>
    ),
  },
];

