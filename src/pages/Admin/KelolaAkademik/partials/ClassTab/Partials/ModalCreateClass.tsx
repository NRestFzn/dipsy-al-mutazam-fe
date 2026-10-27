import { Modal, Form, Input, Select, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";
import { teacherService } from "../../../../../../service/Admin/teacherService";
import type { GradeItem } from "../../../../../../types/Academic/academicTypes";

interface ModalCreateClassProps {
  open: boolean;
  onClose: () => void;
  grades: GradeItem[];
  defaultGradeId?: string | null;
}

export default function ModalCreateClass({
  open,
  onClose,
  grades,
  defaultGradeId,
}: ModalCreateClassProps) {
  const [form] = Form.useForm();
  const { createClassMutation } = useAcademic();

  const { data: teachersRes } = useQuery({
    queryKey: ["teachers", "options"],
    queryFn: () => teacherService.getTeachers({ pageSize: 100 }),
  });
  const teacherOptions = (teachersRes?.data || []).map((teacher) => ({
    label: teacher.fullname,
    value: teacher.id,
  }));

  const handleFinish = async (values: {
    name: string;
    gradeId: string;
    homeroomTeacherId?: string | null;
  }) => {
    try {
      await createClassMutation.mutateAsync(values);
      message.success("Kelas baru berhasil ditambahkan!");
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal menambahkan kelas");
    }
  };

  return (
    <Modal
      title="Tambah Kelas Baru"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      okText="Simpan Kelas"
      cancelText="Batal"
      okButtonProps={{
        loading: createClassMutation.isPending,
        className: "!bg-[#00A651] hover:!bg-[#009245]",
      }}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gradeId: defaultGradeId || undefined }}
        className="pt-3 space-y-3"
      >
        <Form.Item
          label="Tingkat / Jenjang"
          name="gradeId"
          rules={[{ required: true, message: "Pilih tingkat kelas" }]}
        >
          <Select
            placeholder="Pilih Tingkat"
            options={grades.map((g) => ({ label: g.name, value: g.id }))}
          />
        </Form.Item>

        <Form.Item
          label="Nama Kelas"
          name="name"
          rules={[{ required: true, message: "Nama kelas wajib diisi" }]}
        >
          <Input placeholder="Contoh: X MIPA 1, VII-A" />
        </Form.Item>

        <Form.Item
          label="Wali Kelas (Opsional)"
          name="homeroomTeacherId"
        >
          <Select
            placeholder="Pilih guru wali kelas"
            allowClear
            showSearch
            optionFilterProp="label"
            options={teacherOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
