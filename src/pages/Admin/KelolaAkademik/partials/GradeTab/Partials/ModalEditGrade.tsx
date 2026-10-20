import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";
import type { GradeItem } from "../../../../../../types/Academic/academicTypes";

interface ModalEditGradeProps {
  open: boolean;
  onClose: () => void;
  grade: GradeItem | null;
}

export default function ModalEditGrade({ open, onClose, grade }: ModalEditGradeProps) {
  const [form] = Form.useForm();
  const { updateGradeMutation } = useAcademic();

  useEffect(() => {
    if (grade) {
      form.setFieldsValue({ name: grade.name });
    }
  }, [grade, form]);

  const handleFinish = async (values: { name: string }) => {
    if (!grade) return;
    try {
      await updateGradeMutation.mutateAsync({ id: grade.id, payload: values });
      message.success("Nama tingkat berhasil diperbarui!");
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal memperbarui tingkat");
    }
  };

  return (
    <Modal
      title="Ubah Nama Tingkat"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Simpan Perubahan"
      cancelText="Batal"
      okButtonProps={{
        loading: updateGradeMutation.isPending,
        className: "!bg-[#70B748] hover:!bg-[#5e9e3b]",
      }}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-3">
        <Form.Item
          label="Nama Tingkat"
          name="name"
          rules={[{ required: true, message: "Nama tingkat wajib diisi" }]}
        >
          <Input placeholder="Contoh: Kelas X" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
