import { Button, Tooltip, Tag } from "antd";
import { Edit2, Trash2, GraduationCap } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { ClassItem } from "../../../../types/Academic/academicTypes";

interface ClassColumnProps {
  pagination: { page: number; pageSize: number };
  onEdit?: (record: ClassItem) => void;
  onDelete: (record: ClassItem) => void;
  onPromote?: (record: ClassItem) => void;
}

export const getClassColumns = ({
  pagination,
  onEdit,
  onDelete,
  onPromote,
}: ClassColumnProps): ColumnsType<ClassItem> => [
  {
    title: "No",
    key: "index",
    width: 65,
    align: "center",
    render: (_, __, index) => (pagination.page - 1) * pagination.pageSize + index + 1,
  },
  {
    title: "Nama Kelas",
    dataIndex: "name",
    key: "name",
    sorter: true,
    render: (name: string) => (
      <span className="font-semibold text-slate-900">{name}</span>
    ),
  },
  {
    title: "Wali Kelas",
    key: "homeroomTeacher",
    render: (_, record) => (
      <span className="text-slate-600 text-xs">
        {record.homeroomTeacher?.fullname || "Belum ditentukan"}
      </span>
    ),
  },
  {
    title: "Jumlah Siswa",
    dataIndex: "studentCount",
    key: "studentCount",
    align: "center",
    width: 140,
    render: (count: number) => (
      <Tag color="cyan" className="font-medium !rounded-md px-2.5">
        {count || 0} Siswa
      </Tag>
    ),
  },
  {
    title: "Aksi",
    key: "action",
    align: "center",
    width: 140,
    render: (_, record) => (
      <div className="flex items-center justify-center gap-1.5">
        {onPromote && (
          <Tooltip title="Proses Kenaikan Kelas">
            <Button
              type="text"
              size="small"
              icon={<GraduationCap size={15} className="text-slate-600 hover:text-emerald-600" />}
              onClick={() => onPromote(record)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Ubah Data Kelas">
            <Button
              type="text"
              size="small"
              icon={<Edit2 size={15} className="text-slate-600 hover:text-emerald-600" />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        )}
        <Tooltip title="Hapus Kelas">
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
