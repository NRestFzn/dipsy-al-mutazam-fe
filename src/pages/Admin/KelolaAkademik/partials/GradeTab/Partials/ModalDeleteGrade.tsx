import { Modal, Typography, message } from "antd";
import { AlertTriangle } from "lucide-react";
import { useAcademic } from "../../../../../../hooks/Admin/useAcademic";
import type { GradeItem } from "../../../../../../types/Academic/academicTypes";

interface ModalDeleteGradeProps {
  open: boolean;
  onClose: () => void;
  grade: GradeItem | null;
}

export default function ModalDeleteGrade({ open, onClose, grade }: ModalDeleteGradeProps) {
  const { deleteGradeMutation } = useAcademic();

  const handleDelete = async () => {
    if (!grade) return;
    try {
      await deleteGradeMutation.mutateAsync(grade.id);
      message.success(`Tingkat ${grade.name} berhasil dihapus!`);
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal menghapus tingkat");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle size={18} />
          <span>Konfirmasi Hapus Tingkat</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Ya, Hapus Tingkat"
      cancelText="Batal"
      okButtonProps={{
        danger: true,
        loading: deleteGradeMutation.isPending,
      }}
      centered
    >
      <div className="py-2 space-y-2">
        <Typography.Paragraph className="text-slate-700">
          Apakah Anda yakin ingin menghapus <strong>{grade?.name}</strong>?
        </Typography.Paragraph>
        <Typography.Text type="secondary" className="text-xs">
          Perhatian: Menghapus data tingkat ini akan mempengaruhi data kelas dan siswa yang bernaung di bawah jenjang ini.
        </Typography.Text>
      </div>
    </Modal>
  );
}
