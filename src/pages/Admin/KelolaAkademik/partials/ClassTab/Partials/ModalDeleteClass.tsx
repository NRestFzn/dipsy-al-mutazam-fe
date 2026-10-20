import { Modal, Typography, message } from "antd";
import { AlertTriangle } from "lucide-react";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";
import type { ClassItem } from "../../../../../../types/Academic/academicTypes";

interface ModalDeleteClassProps {
  open: boolean;
  onClose: () => void;
  classData: ClassItem | null;
}

export default function ModalDeleteClass({
  open,
  onClose,
  classData,
}: ModalDeleteClassProps) {
  const { deleteClassMutation } = useAcademic();

  const handleDelete = async () => {
    if (!classData) return;
    try {
      await deleteClassMutation.mutateAsync(classData.id);
      message.success(`Kelas ${classData.name} berhasil dihapus!`);
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal menghapus kelas");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle size={18} />
          <span>Konfirmasi Hapus Kelas</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Ya, Hapus Kelas"
      cancelText="Batal"
      okButtonProps={{
        danger: true,
        loading: deleteClassMutation.isPending,
      }}
      centered
    >
      <div className="py-2 space-y-2">
        <Typography.Paragraph className="text-slate-700">
          Apakah Anda yakin ingin menghapus <strong>{classData?.name}</strong>?
        </Typography.Paragraph>
        <Typography.Text type="secondary" className="text-xs">
          Perhatian: Pastikan tidak ada siswa yang masih terdaftar aktif di kelas ini sebelum menghapusnya.
        </Typography.Text>
      </div>
    </Modal>
  );
}
