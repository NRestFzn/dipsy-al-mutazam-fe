import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Empty, Input, Select, Skeleton, Table, Tabs, Tag } from "antd";
import { GraduationCap, Search, Users } from "lucide-react";
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

const matchesQuery = (row: RosterRow, query: string) => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  return (
    row.fullname.toLowerCase().includes(keyword) ||
    (row.nisn ?? "").toLowerCase().includes(keyword)
  );
};

interface RosterRow {
  key: string;
  studentId: string;
  fullname: string;
  nisn?: string | null;
  status?: string | null;
}

interface HistoryRow extends RosterRow {
  academicYear: string;
  className: string;
  gradeName: string;
}

export default function MyStudents() {
  const navigate = useNavigate();
  const { classes: myClasses, classId: defaultClassId } = useMyClassroom();
  const { useStudentsAdmin, useTaughtHistory } = useAcademic();

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyGrade, setHistoryGrade] = useState<string | null>(null);
  const [historyClass, setHistoryClass] = useState<string | null>(null);

  const myClassId = selectedClassId || defaultClassId;
  const myClassName =
    myClasses.find((item) => item.id === myClassId)?.name || "Kelas Binaan";

  const { data: studentsRes, isLoading: loadingStudents } = useStudentsAdmin({
    classroomId: myClassId || undefined,
    status: "semua",
    pageSize: 100,
  });

  const { data: taughtRes, isLoading: loadingTaught } = useTaughtHistory();

  const currentStudents: RosterRow[] = useMemo(
    () =>
      (studentsRes?.data || []).map((item: StudentAdminItem) => ({
        key: item.id,
        studentId: item.id,
        fullname: item.fullname,
        nisn: item.nisn,
        status: item.studentStatus,
      })),
    [studentsRes?.data]
  );

  const filteredCurrentStudents = useMemo(
    () => currentStudents.filter((item) => matchesQuery(item, currentSearch)),
    [currentStudents, currentSearch]
  );

  const historyRows: HistoryRow[] = useMemo(
    () =>
      ((taughtRes?.data || []) as TaughtHistoryItem[]).map((item) => ({
        key: item.id,
        studentId: item.student?.id || "",
        fullname: item.student?.fullname || "-",
        nisn: item.student?.userDetail?.nisn,
        status: item.student?.userDetail?.studentStatus,
        academicYear: item.academicYear || "-",
        className: item.class?.name || "-",
        gradeName: item.grade?.name || "-",
      })),
    [taughtRes?.data]
  );

  const gradeOptions = useMemo(
    () =>
      Array.from(new Set(historyRows.map((item) => item.gradeName)))
        .filter((name) => name && name !== "-")
        .map((name) => ({ label: name, value: name })),
    [historyRows]
  );

  const classOptions = useMemo(
    () =>
      Array.from(new Set(historyRows.map((item) => item.className)))
        .filter((name) => name && name !== "-")
        .map((name) => ({ label: name, value: name })),
    [historyRows]
  );

  const filteredHistoryRows = useMemo(
    () =>
      historyRows.filter(
        (item) =>
          matchesQuery(item, historySearch) &&
          (!historyGrade || item.gradeName === historyGrade) &&
          (!historyClass || item.className === historyClass)
      ),
    [historyRows, historySearch, historyGrade, historyClass]
  );

  const taughtGroups = useMemo(() => {
    const groups: Record<
      string,
      { academicYear: string; className: string; rows: HistoryRow[] }
    > = {};

    filteredHistoryRows.forEach((item) => {
      const key = `${item.academicYear}-${item.className}`;

      if (!groups[key]) {
        groups[key] = {
          academicYear: item.academicYear,
          className: item.className,
          rows: [],
        };
      }

      groups[key].rows.push(item);
    });

    return Object.values(groups).sort((a, b) =>
      `${b.academicYear}-${b.className}`.localeCompare(`${a.academicYear}-${a.className}`)
    );
  }, [filteredHistoryRows]);

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
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/admin/siswa-saya/preview-siswa/${record.studentId}`)}
        >
          Lihat
        </Button>
      ),
    },
  ];

  const searchInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    className: string
  ) => (
    <Input
      placeholder={placeholder}
      prefix={<Search className="text-slate-400" size={16} />}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      allowClear
      className={className}
    />
  );

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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {myClasses.length > 1 ? (
                        <Select
                          value={myClassId || undefined}
                          onChange={(value) => setSelectedClassId(value)}
                          options={myClasses.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))}
                          className="w-40 !rounded-lg"
                        />
                      ) : (
                        <span className="font-semibold text-slate-800">
                          {myClassName || "Belum ada kelas"}
                        </span>
                      )}
                      {myClassId && (
                        <span className="text-xs text-slate-400">
                          ({filteredCurrentStudents.length} siswa)
                        </span>
                      )}
                    </div>

                    <div className="w-full sm:w-72">
                      {searchInput(
                        currentSearch,
                        setCurrentSearch,
                        "Cari nama atau NISN...",
                        "!rounded-lg"
                      )}
                    </div>
                  </div>

                  {loadingStudents ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : !myClassId ? (
                    <Empty description="Anda belum ditugaskan sebagai wali kelas" />
                  ) : (
                    <Table<RosterRow>
                      columns={columns}
                      dataSource={filteredCurrentStudents}
                      loading={loadingStudents}
                      pagination={{ pageSize: 10, showSizeChanger: false }}
                      locale={{
                        emptyText: currentSearch
                          ? "Tidak ada siswa yang cocok dengan pencarian."
                          : "Belum ada siswa di kelas ini.",
                      }}
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {searchInput(
                      historySearch,
                      setHistorySearch,
                      "Cari nama atau NISN...",
                      "!rounded-lg"
                    )}

                    <Select
                      placeholder="Semua Tingkat"
                      value={historyGrade}
                      onChange={(value) => setHistoryGrade(value ?? null)}
                      allowClear
                      options={gradeOptions}
                      className="w-full !rounded-lg"
                    />

                    <Select
                      placeholder="Semua Kelas"
                      value={historyClass}
                      onChange={(value) => setHistoryClass(value ?? null)}
                      allowClear
                      options={classOptions}
                      className="w-full !rounded-lg"
                    />
                  </div>

                  {loadingTaught ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                  ) : taughtGroups.length === 0 ? (
                    <Empty
                      description={
                        historySearch || historyGrade || historyClass
                          ? "Tidak ada riwayat yang cocok dengan filter."
                          : "Belum ada riwayat kelas yang pernah Anda ampu"
                      }
                    />
                  ) : (
                    taughtGroups.map((group) => (
                      <div key={`${group.academicYear}-${group.className}`} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{group.academicYear}</span>
                          <Tag color="cyan" className="!rounded-md font-medium">
                            {group.className}
                          </Tag>
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
