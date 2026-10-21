import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";
import type { ClassItem, GradeItem } from "../../../../../../types/Academic/academicTypes";

interface ModalEditClassProps {
  open: boolean;
  onClose: () => void;
  classData: ClassItem | null;
  grades: GradeItem[];
}

export default function ModalEditClass({
  open,
  onClose,
  classData,
  grades,
}: ModalEditClassProps) {
  const [form] = Form.useForm();
  const { updateClassMutation } = useAcademic();

  useEffect(() => {
    if (classData) {
      form.setFieldsValue({
        name: classData.name,
        gradeId: classData.gradeId || classData.RukunWargaId,
        homeroomTeacher: classData.homeroomTeacher || "",
      });
    }
  }, [classData, form]);

  const handleFinish = async (values: {
    name: string;
    gradeId: string;
    homeroomTeacher?: string;
  }) => {
    if (!classData) return;
    try {
      await updateClassMutation.mutateAsync({
        id: classData.id,
        payload: values,
      });
      message.success("Data kelas berhasil diperbarui!");
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal memperbarui kelas");
    }
  };

  return (
    <Modal
      title="Ubah Data Kelas"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Simpan Perubahan"
      cancelText="Batal"
      okButtonProps={{
        loading: updateClassMutation.isPending,
        className: "!bg-[#00A651] hover:!bg-[#009245]",
      }}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-3 space-y-3">
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
          <Input placeholder="Contoh: X MIPA 1" />
        </Form.Item>

        <Form.Item label="Wali Kelas" name="homeroomTeacher">
          <Input placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
