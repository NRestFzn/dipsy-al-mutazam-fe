import { Button, Tooltip, Tag } from "antd";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { StudentAdminItem } from "../../../../types/Academic/academicTypes";

interface StudentColumnProps {
  pagination: { page: number; pageSize: number };
  onDetail: (record: StudentAdminItem) => void;
  onEdit: (record: StudentAdminItem) => void;
  onDelete: (record: StudentAdminItem) => void;
}

export const getStudentColumns = ({
  pagination,
  onDetail,
  onEdit,
  onDelete,
}: StudentColumnProps): ColumnsType<StudentAdminItem> => [
  {
    title: "No",
    key: "index",
    width: 60,
    align: "center",
    render: (_, __, index) => (pagination.page - 1) * pagination.pageSize + index + 1,
  },
  {
    title: "NISN",
    dataIndex: "nisn",
    key: "nisn",
    width: 120,
    render: (nisn: string) => (
      <span className="font-mono font-medium text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
        {nisn || "-"}
      </span>
    ),
  },
  {
    title: "Nama Lengkap Siswa",
    dataIndex: "fullname",
    key: "fullname",
    sorter: true,
    render: (name: string, record) => (
      <div>
        <div className="font-semibold text-slate-900 leading-snug">{name}</div>
        {record.email && (
          <div className="text-[11px] text-slate-400 font-normal">{record.email}</div>
        )}
      </div>
    ),
  },
  {
    title: "L/P",
    dataIndex: "gender",
    key: "gender",
    width: 80,
    align: "center",
    render: (gender: string) =>
      gender === "m" ? (
        <Tag color="blue" className="!rounded-md text-[11px] font-semibold">
          Laki-laki
        </Tag>
      ) : (
        <Tag color="magenta" className="!rounded-md text-[11px] font-semibold">
          Perempuan
        </Tag>
      ),
  },
  {
    title: "Tingkat",
    key: "grade",
    width: 100,
    render: (_, record) => (
      <span className="text-xs text-slate-700 font-medium">
        {record.gradeLevel?.name || "-"}
      </span>
    ),
  },
  {
    title: "Kelas",
    key: "class",
    width: 110,
    render: (_, record) => (
      <Tag color="geekblue" className="!rounded-md text-xs font-medium">
        {record.classroom?.name || "-"}
      </Tag>
    ),
  },
  {
    title: "Status",
    key: "status",
    width: 95,
    align: "center",
    render: (_, record) => {
      const isLulus = record.status === "Lulus";
      return (
        <Tag
          className={`!rounded-md text-[11px] font-semibold ${
            isLulus
              ? "!bg-slate-100 !text-slate-600 !border-slate-300"
              : "!bg-emerald-50 !text-emerald-700 !border-emerald-200"
          }`}
        >
          {record.status || "Aktif"}
        </Tag>
      );
    },
  },
  {
    title: "No. HP / WA",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 130,
    render: (phone: string) => (
      <span className="text-xs text-slate-600">{phone || "-"}</span>
    ),
  },
  {
    title: "Aksi",
    key: "action",
    align: "center",
    width: 120,
    render: (_, record) => (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title="Lihat Profil Siswa & Riwayat">
          <Button
            type="text"
            size="small"
            icon={<Eye size={15} className="text-slate-600 hover:text-emerald-600" />}
            onClick={() => onDetail(record)}
          />
        </Tooltip>
        <Tooltip title="Ubah Data Siswa">
          <Button
            type="text"
            size="small"
            icon={<Edit2 size={15} className="text-slate-600 hover:text-emerald-600" />}
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Hapus Siswa">
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
