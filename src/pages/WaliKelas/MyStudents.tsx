import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Empty, Skeleton, Table, Tabs, Tag } from "antd";
import { GraduationCap, Users } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useAcademic } from "../../hooks/Admin/useAcademic";
import { useMyClassroom } from "../../hooks/Admin/useMyClassroom";
import type { StudentAdminItem, TaughtHistoryItem } from "../../types/Academic/academicTypes";

const statusTag = (status?: string | null) => {
  if (status === "lulus") {
    return <Tag color="purple" className="!rounded-md text-[11px] font-semibold">Lulus</Tag>;
  }
  if (status === "pindah") {
    return <Tag color="orange" className="!rounded-md text-[11px] font-semibold">Pindah</Tag>;
  }
  return <Tag color="emerald" className="!rounded-md text-[11px] font-semibold">Aktif</Tag>;
};

interface RosterRow {
  key: string;
  studentId: string;
  fullname: string;
  nisn?: string | null;
  status?: string | null;
}

export default function MyStudents() {
  const navigate = useNavigate();
  const { classId: myClassId, className: myClassName } = useMyClassroom();
  const { useStudentsAdmin, useTaughtHistory } = useAcademic();

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const { data: studentsRes, isLoading: loadingStudents } = useStudentsAdmin({
    classroomId: myClassId || undefined,
    status: "semua",
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const { data: taughtRes, isLoading: loadingTaught } = useTaughtHistory();

  const currentStudents: RosterRow[] = (studentsRes?.data || []).map((item: StudentAdminItem) => ({
    key: item.id,
    studentId: item.id,
    fullname: item.fullname,
    nisn: item.nisn,
    status: item.studentStatus,
  }));

  const taughtRows = (taughtRes?.data || []) as TaughtHistoryItem[];

  const taughtGroups = taughtRows.reduce<Record<string, { academicYear: string; className: string; rows: RosterRow[] }>>(
    (groups, item) => {
      const academicYear = item.academicYear || "-";
      const className = item.class?.name || "-";
      const key = `${academicYear}-${className}`;

      if (!groups[key]) {
        groups[key] = { academicYear, className, rows: [] };
      }

      groups[key].rows.push({
        key: item.id,
        studentId: item.student?.id || "",
        fullname: item.student?.fullname || "-",
        nisn: item.student?.userDetail?.nisn,
        status: item.student?.userDetail?.studentStatus,
      });

      return groups;
    },
    {}
  );

  const columns: ColumnsType<RosterRow> = [
    {
      title: "Nama Siswa",
      dataIndex: "fullname",
      key: "fullname",
      render: (value: string) => <span className="font-semibold text-slate-800">{value}</span>,
    },
    {
      title: "NISN",
      dataIndex: "nisn",
      key: "nisn",
      width: 160,
      render: (value?: string | null) => (
        <span className="font-mono text-xs text-slate-600">{value || "-"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      align: "center",
      render: (value?: string | null) => statusTag(value),
    },
    {
      title: "Aksi",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/admin/siswa-saya/preview-siswa/${record.studentId}`)}>
          Lihat
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-2">
          Wali Kelas
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Siswa Saya</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Daftar siswa di kelas yang Anda ampu saat ini dan kelas yang pernah Anda ampu pada tahun ajaran sebelumnya.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <Tabs
          defaultActiveKey="current"
          items={[
            {
              key: "current",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <Users size={16} />
                  Kelas Saat Ini
                </span>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">{myClassName || "Belum ada kelas"}</span>
                    {myClassId && <span className="text-xs text-slate-400">({currentStudents.length} siswa)</span>}
                  </div>

                  {loadingStudents ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : !myClassId ? (
                    <Empty description="Anda belum ditugaskan sebagai wali kelas" />
                  ) : (
                    <Table<RosterRow>
                      columns={columns}
                      dataSource={currentStudents}
                      loading={loadingStudents}
                      pagination={{
                        current: pagination.page,
                        pageSize: pagination.pageSize,
                        total: studentsRes?.meta?.pagination?.total ?? currentStudents.length,
                        onChange: (page, pageSize) => setPagination({ page, pageSize }),
                      }}
                      locale={{ emptyText: "Belum ada siswa di kelas ini." }}
                    />
                  )}
                </div>
              ),
            },
            {
              key: "history",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <GraduationCap size={16} />
                  Riwayat Kelas
                </span>
              ),
              children: (
                <div className="space-y-5 pt-2">
                  {loadingTaught ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : Object.keys(taughtGroups).length === 0 ? (
                    <Empty description="Belum ada riwayat kelas yang pernah Anda ampu" />
                  ) : (
                    Object.values(taughtGroups).map((group) => (
                      <div key={`${group.academicYear}-${group.className}`} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{group.academicYear}</span>
                          <Tag color="cyan" className="!rounded-md font-medium">{group.className}</Tag>
                          <span className="text-xs text-slate-400">{group.rows.length} siswa</span>
                        </div>
                        <Table<RosterRow>
                          columns={columns}
                          dataSource={group.rows}
                          pagination={false}
                          size="small"
                        />
                      </div>
                    ))
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
