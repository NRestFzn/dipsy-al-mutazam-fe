import { useState } from "react";
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
  message,
} from "antd";
import { Pencil, Plus, Search, Trash2, UserCog } from "lucide-react";
import { useDebounce } from "use-debounce";
import type { ColumnsType } from "antd/es/table";
import { teacherService } from "../../../service/Admin/teacherService";
import { academicService } from "../../../service/Admin/academicService";
import type {
  CreateTeacherPayload,
  TeacherItem,
  UpdateTeacherPayload,
} from "../../../types/Teacher/teacherTypes";

export default function KelolaGuru() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherItem | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState<TeacherItem | null>(null);

  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", debouncedSearch, pagination],
    queryFn: () =>
      teacherService.getTeachers({
        search: debouncedSearch || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
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
    mutationFn: (values: any) =>
      editing
        ? teacherService.updateTeacher(editing.id, values as UpdateTeacherPayload)
        : teacherService.createTeacher(values as CreateTeacherPayload),
    onSuccess: () => {
      message.success(editing ? "Data guru diperbarui" : "Guru ditambahkan");
      setFormOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error: any) => message.error(error?.message || "Gagal menyimpan data guru"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      message.success("Guru dihapus");
      refresh();
    },
    onError: (error: any) => message.error(error?.message || "Gagal menghapus guru"),
  });

  const assignMutation = useMutation({
    mutationFn: async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
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
    onError: (error: any) => message.error(error?.message || "Gagal menugaskan kelas"),
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

  const columns: ColumnsType<TeacherItem> = [
    {
      title: "Nama",
      dataIndex: "fullname",
      key: "fullname",
      render: (text: string) => <span className="font-semibold text-slate-900">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-slate-600">{text}</span>,
    },
    {
      title: "Role",
      key: "role",
      width: 140,
      render: (_, record) =>
        record.roles?.map((role) => (
          <Tag key={role.id} color={role.name === "gurubk" ? "blue" : "gold"} className="!rounded-md">
            {role.name === "gurubk" ? "Guru BK" : "Wali Kelas"}
          </Tag>
        )),
    },
    {
      title: "Kelas Diampu",
      key: "homeroom",
      render: (_, record) =>
        record.homeroomClasses?.length ? (
          record.homeroomClasses.map((item) => (
            <Tag key={item.id} color="emerald" className="!rounded-md">
              {item.name}
            </Tag>
          ))
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Button type="text" size="small" onClick={() => openAssign(record)} title="Tugaskan kelas">
            <UserCog size={16} />
          </Button>
          <Button type="text" size="small" onClick={() => openEdit(record)} title="Ubah">
            <Pencil size={16} />
          </Button>
          <Popconfirm
            title="Hapus guru ini?"
            description="Guru yang masih menjadi wali kelas tidak bisa dihapus."
            okText="Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button type="text" danger size="small" title="Hapus">
              <Trash2 size={16} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-2">
          Manajemen Sekolah
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Guru</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Kelola akun Guru BK dan Wali Kelas serta penugasan wali kelas pada setiap kelas.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Input
          placeholder="Cari nama atau email guru..."
          prefix={<Search className="text-slate-400" size={16} />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          allowClear
          className="w-full sm:w-80 !rounded-lg"
        />
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
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)} className="pt-2">
          <Form.Item label="Nama Lengkap" name="fullname" rules={[{ required: true, message: "Nama wajib diisi" }]}>
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
            <Input.Password placeholder={editing ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"} />
          </Form.Item>
          <Form.Item label="Role" name="roleName" rules={[{ required: true, message: "Role wajib dipilih" }]}>
            <Select
              options={[
                { value: "gurubk", label: "Guru BK" },
                { value: "walikelas", label: "Wali Kelas" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Tugaskan Kelas — ${assigning?.fullname ?? ""}`}
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
                label: item.grade?.name ? `${item.name} (${item.grade.name})` : item.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
