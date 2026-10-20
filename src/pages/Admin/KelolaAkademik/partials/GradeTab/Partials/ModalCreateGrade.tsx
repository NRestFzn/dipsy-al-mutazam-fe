import { Modal, Form, Input, InputNumber, message } from "antd";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";

interface ModalCreateGradeProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalCreateGrade({ open, onClose }: ModalCreateGradeProps) {
  const [form] = Form.useForm();
  const { createGradeMutation } = useAcademic();

  const handleFinish = async (values: { name: string; count?: number }) => {
    try {
      await createGradeMutation.mutateAsync(values);
      message.success("Tingkat baru berhasil ditambahkan!");
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal menambahkan tingkat");
    }
  };

  return (
    <Modal
      title="Tambah Tingkat / Jenjang Baru"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      okText="Simpan"
      cancelText="Batal"
      okButtonProps={{
        loading: createGradeMutation.isPending,
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
          <Input placeholder="Contoh: Kelas VII, Kelas X" />
        </Form.Item>

        <Form.Item
          label="Jumlah Tingkat yang Digenerate (Opsional)"
          name="count"
          tooltip="Digunakan jika ingin membuat beberapa nomor tingkat sekaligus"
        >
          <InputNumber min={1} max={10} className="w-full" placeholder="1" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
