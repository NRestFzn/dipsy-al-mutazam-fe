import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCog,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import type { ColumnsType } from "antd/es/table";
import { teacherService } from "../../../service/Admin/teacherService";
import { academicService } from "../../../service/Admin/academicService";
import type {
  CreateTeacherPayload,
  TeacherItem,
  UpdateTeacherPayload,
} from "../../../types/Teacher/teacherTypes";
import { getAcademicYearOptions } from "../../../utils/academicYear";
import { useCurrentAcademicYear } from "../../../hooks/Admin/useCurrentAcademicYear";
import CounselorClassModal from "./Partials/CounselorClassModal";

export default function KelolaGuru() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const { academicYear: serverAcademicYear } = useCurrentAcademicYear();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(
    serverAcademicYear
  );

  useEffect(() => {
    setSelectedAcademicYear(serverAcademicYear);
  }, [serverAcademicYear]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherItem | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState<TeacherItem | null>(null);

  // Counselor Assignment Modal state
  const [counselorModalOpen, setCounselorModalOpen] = useState(false);
  const [counselorAssigning, setCounselorAssigning] = useState<TeacherItem | null>(
    null
  );

  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", debouncedSearch, pagination, selectedAcademicYear],
    queryFn: () =>
      teacherService.getTeachers({
        search: debouncedSearch || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
        academicYear: selectedAcademicYear,
      }),
  });

  const { data: classesData } = useQuery({
    queryKey: ["academic", "classes", "all"],
    queryFn: () => academicService.getClasses({ pageSize: 100 }),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["teachers"] });
    queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: CreateTeacherPayload | UpdateTeacherPayload) =>
      editing
        ? teacherService.updateTeacher(editing.id, values as UpdateTeacherPayload)
        : teacherService.createTeacher(values as CreateTeacherPayload),
    onSuccess: () => {
      message.success(editing ? "Data guru diperbarui" : "Guru ditambahkan");
      setFormOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal menyimpan data guru";
      message.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      message.success("Guru dihapus");
      refresh();
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal menghapus guru";
      message.error(msg);
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      classId,
      teacherId,
    }: {
      classId: string;
      teacherId: string;
    }) => {
      const cls = classesData?.data?.find((item) => item.id === classId);
      if (!cls) throw new Error("Kelas tidak ditemukan");

      return academicService.updateClass(cls.id, {
        name: cls.name,
        gradeId: cls.gradeId || "",
        homeroomTeacherId: teacherId,
      });
    },
    onSuccess: () => {
      message.success("Penugasan wali kelas diperbarui");
      setAssignOpen(false);
      setAssigning(null);
      refresh();
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal menugaskan kelas";
      message.error(msg);
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ roleName: "walikelas" });
    setFormOpen(true);
  };

  const openEdit = (record: TeacherItem) => {
    setEditing(record);
    form.setFieldsValue({
      fullname: record.fullname,
      email: record.email,
      roleName: record.roles?.[0]?.name ?? "walikelas",
      password: undefined,
    });
    setFormOpen(true);
  };

  const openAssign = (record: TeacherItem) => {
    setAssigning(record);
    assignForm.resetFields();
    assignForm.setFieldsValue({
      classId: record.homeroomClasses?.[0]?.id ?? undefined,
    });
    setAssignOpen(true);
  };

  const openCounselorModal = (record: TeacherItem) => {
    setCounselorAssigning(record);
    setCounselorModalOpen(true);
  };

  const academicYearOptions = useMemo(() => {
    return getAcademicYearOptions(selectedAcademicYear);
  }, [selectedAcademicYear]);

  const columns: ColumnsType<TeacherItem> = [
    {
      title: "Nama",
      dataIndex: "fullname",
      key: "fullname",
      render: (text: string) => (
        <span className="font-semibold text-slate-900">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <span className="text-slate-600">{text}</span>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 140,
      render: (_, record) =>
        record.roles?.map((role) => (
          <Tag
            key={role.id}
            color={role.name === "gurubk" ? "blue" : "gold"}
            className="!rounded-md"
          >
            {role.name === "gurubk" ? "Guru BK" : "Wali Kelas"}
          </Tag>
        )),
    },
    {
      title: "Wali Kelas",
      key: "homeroom",
      render: (_, record) => {
        const isWali = record.roles?.some((r) => r.name === "walikelas");
        if (!isWali) {
          return <span className="text-slate-300">-</span>;
        }
        return record.homeroomClasses?.length ? (
          record.homeroomClasses.map((item) => (
            <Tag key={item.id} color="emerald" className="!rounded-md">
              {item.name}
            </Tag>
          ))
        ) : (
          <span className="text-slate-400 text-xs italic">Belum ada kelas</span>
        );
      },
    },
    {
      title: "Kelas BK",
      key: "counselor",
      render: (_, record) => {
        const isBK = record.roles?.some((r) => r.name === "gurubk");
        if (!isBK) {
          return <span className="text-slate-300">-</span>;
        }

        const classes = record.counselorClasses ?? [];
        if (!classes.length) {
          return (
            <span className="text-slate-400 text-xs italic">
              Belum ada kelas
            </span>
          );
        }

        const visibleClasses = classes.slice(0, 3);
        const remainingCount = classes.length - visibleClasses.length;

        return (
          <div className="flex flex-wrap items-center gap-1">
            {visibleClasses.map((item) => (
              <Tag
                key={item.id}
                color="blue"
                className="!rounded-md !m-0 !text-xs font-medium"
              >
                {item.name}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tooltip
                title={
                  <div className="text-xs space-y-1 p-1">
                    <div className="font-semibold border-b border-slate-600 pb-1">
                      Kelas BK Diampu ({classes.length}):
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1 max-w-xs">
                      {classes.map((cls) => (
                        <span
                          key={cls.id}
                          className="bg-slate-700 text-white px-1.5 py-0.5 rounded text-[11px]"
                        >
                          {cls.name}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              >
                <Tag
                  color="default"
                  className="!rounded-md !m-0 !text-xs cursor-pointer hover:!border-blue-400"
                >
                  +{remainingCount} lainnya
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 170,
      align: "center",
      render: (_, record) => {
        const isBK = record.roles?.some((r) => r.name === "gurubk");
        const isWali = record.roles?.some((r) => r.name === "walikelas");

        return (
          <div className="flex items-center justify-center gap-1">
            {isBK ? (
              <Tooltip title="Atur Kelas BK">
                <Button
                  type="text"
                  size="small"
                  onClick={() => openCounselorModal(record)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <GraduationCap size={16} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Hanya untuk Guru BK">
                <Button
                  type="text"
                  size="small"
                  disabled
                  className="!text-slate-300 cursor-not-allowed"
                >
                  <GraduationCap size={16} />
                </Button>
              </Tooltip>
            )}

            {isWali ? (
              <Tooltip title="Tugaskan Wali Kelas">
                <Button
                  type="text"
                  size="small"
                  onClick={() => openAssign(record)}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <UserCog size={16} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Hanya untuk Wali Kelas">
                <Button
                  type="text"
                  size="small"
                  disabled
                  className="!text-slate-300 cursor-not-allowed"
                >
                  <UserCog size={16} />
                </Button>
              </Tooltip>
            )}

            <Tooltip title="Ubah Data Guru">
              <Button type="text" size="small" onClick={() => openEdit(record)}>
                <Pencil size={16} />
              </Button>
            </Tooltip>

            <Popconfirm
              title="Hapus guru ini?"
              description="Guru yang masih menjadi wali kelas tidak bisa dihapus."
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Tooltip title="Hapus">
                <Button type="text" danger size="small">
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-2">
          Manajemen Sekolah
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kelola Guru
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Kelola akun Guru BK dan Wali Kelas serta penugasan kelas per tahun
          ajaran.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Input
            placeholder="Cari nama atau email guru..."
            prefix={<Search className="text-slate-400" size={16} />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            allowClear
            className="w-full sm:w-72 !rounded-lg"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
              Tahun Ajaran:
            </span>
            <Select
              value={selectedAcademicYear}
              onChange={(val) => {
                setSelectedAcademicYear(val);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              options={academicYearOptions}
              className="w-36 sm:w-44 !rounded-lg"
            />
          </div>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          className="!bg-[#00A651] hover:!bg-[#009245] !border-none !rounded-lg !font-semibold"
        >
          Tambah Guru
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table<TeacherItem>
          rowKey="id"
          loading={isLoading}
          dataSource={data?.data ?? []}
          columns={columns}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.meta?.pagination?.total ?? 0,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
            className: "!px-4 !mb-4",
          }}
        />
      </div>

      {/* Modal Tambah / Ubah Guru */}
      <Modal
        title={editing ? "Ubah Data Guru" : "Tambah Guru"}
        open={formOpen}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={saveMutation.isPending}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          className="pt-2"
        >
          <Form.Item
            label="Nama Lengkap"
            name="fullname"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input placeholder="Nama lengkap guru" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email wajib diisi" },
              { type: "email", message: "Format email tidak valid" },
            ]}
          >
            <Input placeholder="nama@al-multazam.sch.id" />
          </Form.Item>
          <Form.Item
            label={editing ? "Kata Sandi Baru (opsional)" : "Kata Sandi"}
            name="password"
            rules={
              editing
                ? [{ min: 8, message: "Minimal 8 karakter" }]
                : [
                    { required: true, message: "Kata sandi wajib diisi" },
                    { min: 8, message: "Minimal 8 karakter" },
                  ]
            }
          >
            <Input.Password
              placeholder={
                editing ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"
              }
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="roleName"
            rules={[{ required: true, message: "Role wajib dipilih" }]}
          >
            <Select
              options={[
                { value: "gurubk", label: "Guru BK" },
                { value: "walikelas", label: "Wali Kelas" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Penugasan Wali Kelas */}
      <Modal
        title={`Tugaskan Wali Kelas — ${assigning?.fullname ?? ""}`}
        open={assignOpen}
        onCancel={() => {
          setAssignOpen(false);
          setAssigning(null);
        }}
        onOk={() => assignForm.submit()}
        confirmLoading={assignMutation.isPending}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form
          form={assignForm}
          layout="vertical"
          className="pt-2"
          onFinish={(values) =>
            assigning &&
            assignMutation.mutate({
              classId: values.classId,
              teacherId: assigning.id,
            })
          }
        >
          <Form.Item
            label="Kelas"
            name="classId"
            rules={[{ required: true, message: "Pilih kelas" }]}
            extra="Pilih kelas yang diampu guru ini. Satu kelas hanya punya satu wali kelas."
          >
            <Select
              placeholder="Pilih kelas"
              options={(classesData?.data ?? []).map((item) => ({
                value: item.id,
                label: item.grade?.name
                  ? `${item.name} (${item.grade.name})`
                  : item.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Penugasan Kelas BK per Tahun Ajaran */}
      <CounselorClassModal
        open={counselorModalOpen}
        counselor={counselorAssigning}
        initialAcademicYear={selectedAcademicYear}
        onClose={() => {
          setCounselorModalOpen(false);
          setCounselorAssigning(null);
        }}
        onSuccess={refresh}
      />
    </div>
  );
}
