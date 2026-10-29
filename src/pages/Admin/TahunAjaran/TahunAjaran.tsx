import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { academicYearService } from "../../../service/Admin/academicYearService";
import type { AcademicYearItem } from "../../../types/Academic/academicTypes";

const { RangePicker } = DatePicker;

export default function TahunAjaran() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicYearItem | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["academic-year", "list"],
    queryFn: () => academicYearService.getAll(),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["academic-year"] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      const payload = {
        name: values.name,
        startDate: values.period?.[0]
          ? dayjs(values.period[0]).format("YYYY-MM-DD")
          : null,
        endDate: values.period?.[1]
          ? dayjs(values.period[1]).format("YYYY-MM-DD")
          : null,
      };

      return editing
        ? academicYearService.update(editing.id, payload)
        : academicYearService.create(payload);
    },
    onSuccess: () => {
      message.success(editing ? "Tahun ajaran diperbarui" : "Tahun ajaran ditambahkan");
      setFormOpen(false);
      setEditing(null);
      refresh();
    },
    onError: (error: any) =>
      message.error(error?.message || "Gagal menyimpan tahun ajaran"),
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => academicYearService.activate(id),
    onSuccess: () => {
      message.success("Tahun ajaran diaktifkan");
      refresh();
    },
    onError: (error: any) =>
      message.error(error?.message || "Gagal mengaktifkan tahun ajaran"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicYearService.remove(id),
    onSuccess: () => {
      message.success("Tahun ajaran dihapus");
      refresh();
    },
    onError: (error: any) =>
      message.error(error?.message || "Gagal menghapus tahun ajaran"),
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setFormOpen(true);
  };

  const openEdit = (record: AcademicYearItem) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      period:
        record.startDate && record.endDate
          ? [dayjs(record.startDate), dayjs(record.endDate)]
          : undefined,
    });
    setFormOpen(true);
  };

  const columns: ColumnsType<AcademicYearItem> = [
    {
      title: "No",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tahun Ajaran",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value: string) => (
        <span className="font-semibold text-slate-900">{value}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      align: "center",
      sorter: (a, b) => Number(b.isActive) - Number(a.isActive),
      render: (value: boolean) =>
        value ? (
          <Tag color="emerald" className="!rounded-md font-semibold">
            Aktif
          </Tag>
        ) : (
          <Tag className="!rounded-md">Tidak aktif</Tag>
        ),
    },
    {
      title: "Periode",
      key: "period",
      render: (_, record) =>
        record.startDate && record.endDate ? (
          <span className="text-xs text-slate-600">
            {dayjs(record.startDate).format("D MMM YYYY")} —{" "}
            {dayjs(record.endDate).format("D MMM YYYY")}
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          {!record.isActive && (
            <Tooltip title="Aktifkan tahun ajaran">
              <Popconfirm
                title={`Aktifkan ${record.name}?`}
                description="Tahun ajaran lain akan dinonaktifkan."
                okText="Aktifkan"
                cancelText="Batal"
                onConfirm={() => activateMutation.mutate(record.id)}
              >
                <Button type="text" size="small" className="text-emerald-600">
                  <CheckCircle2 size={16} />
                </Button>
              </Popconfirm>
            </Tooltip>
          )}

          <Tooltip title="Ubah">
            <Button type="text" size="small" onClick={() => openEdit(record)}>
              <Pencil size={16} />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Hapus tahun ajaran ini?"
            description="Tahun yang sudah dipakai data tidak dapat dihapus."
            okText="Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteMutation.mutate(record.id)}
            disabled={record.isActive}
          >
            <Tooltip
              title={
                record.isActive
                  ? "Tahun ajaran aktif tidak dapat dihapus"
                  : "Hapus"
              }
            >
              <Button
                type="text"
                danger
                size="small"
                disabled={record.isActive}
              >
                <Trash2 size={16} />
              </Button>
            </Tooltip>
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tahun Ajaran
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Kelola daftar tahun ajaran dan tentukan tahun ajaran yang aktif. Tahun
          aktif dipakai sebagai default di dashboard dan form akademik.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          className="!bg-[#00A651] hover:!bg-[#009245] !border-none !rounded-lg !font-semibold"
        >
          Tambah Tahun Ajaran
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table<AcademicYearItem>
          rowKey="id"
          loading={isLoading}
          dataSource={rows}
          columns={columns}
          pagination={{
            pageSize: 10,
            className: "!px-4 !mb-4",
          }}
          locale={{ emptyText: "Belum ada tahun ajaran." }}
        />
      </div>

      <Modal
        title={editing ? "Ubah Tahun Ajaran" : "Tambah Tahun Ajaran"}
        open={formOpen}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={saveMutation.isPending}
        okText="Simpan"
        cancelText="Batal"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          className="pt-2"
          onFinish={(values) => saveMutation.mutate(values)}
        >
          <Form.Item
            label="Nama Tahun Ajaran"
            name="name"
            rules={[
              { required: true, message: "Tahun ajaran wajib diisi" },
              {
                pattern: /^\d{4}\/\d{4}$/,
                message: "Format harus YYYY/YYYY",
              },
            ]}
          >
            <Input placeholder="Contoh: 2026/2027" />
          </Form.Item>

          <Form.Item
            label="Periode (Opsional)"
            name="period"
            extra="Kosongkan bila belum ingin mengatur tanggal mulai dan selesai."
          >
            <RangePicker className="w-full" format="DD MMM YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
