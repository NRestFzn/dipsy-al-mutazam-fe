import { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Table, Tag, Button, message, Alert } from "antd";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useAcademic } from "../../../../hooks/Admin/useAcademic";
import type { ClassItem, GradeItem, StudentAdminItem } from "../../../../types/Academic/academicTypes";

interface ClassPromotionModalProps {
  open: boolean;
  onCancel: () => void;
  classes: ClassItem[];
  grades: GradeItem[];
}

interface StudentPromotionRow {
  studentId: string;
  fullname: string;
  nisn: string;
  action: "promote" | "retain" | "graduate";
  targetClassId?: string;
  note?: string;
}

export default function ClassPromotionModal({
  open,
  onCancel,
  classes,
  grades,
}: ClassPromotionModalProps) {
  const [form] = Form.useForm();
  const [selectedSourceClassId, setSelectedSourceClassId] = useState<string | null>(null);
  const [targetAcademicYear, setTargetAcademicYear] = useState<string>("2025/2026");
  const [promotionRows, setPromotionRows] = useState<StudentPromotionRow[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { useStudentsAdmin, promoteStudentsMutation } = useAcademic();

  const { data: studentsRes, isLoading: loadingStudents } = useStudentsAdmin({
    classroomId: selectedSourceClassId || undefined,
    pageSize: 100,
    status: "Aktif",
  });

  const sourceClass = classes.find((c) => c.id === selectedSourceClassId);
  const sourceGrade = grades.find((g) => g.id === sourceClass?.gradeId);
  const isTerminalGrade = sourceGrade?.name.includes("IX") || sourceGrade?.name.includes("XII");

  // Suggest a default target class (e.g., if VII-A -> suggest VIII-A)
  const getSuggestedTargetClass = (srcCls?: ClassItem): string | undefined => {
    if (!srcCls) return undefined;
    if (srcCls.name.includes("VII-")) {
      const targetName = srcCls.name.replace("VII-", "VIII-");
      return classes.find((c) => c.name.includes(targetName))?.id;
    }
    if (srcCls.name.includes("VIII-")) {
      const targetName = srcCls.name.replace("VIII-", "IX-");
      return classes.find((c) => c.name.includes(targetName))?.id;
    }
    if (srcCls.name.includes("X-")) {
      const targetName = srcCls.name.replace("X-", "XI-IPA");
      return classes.find((c) => c.name.includes(targetName))?.id;
    }
    if (srcCls.name.includes("XI-")) {
      const targetName = srcCls.name.replace("XI-", "XII-");
      return classes.find((c) => c.name.includes(targetName))?.id;
    }
    return undefined;
  };

  useEffect(() => {
    if (studentsRes?.data && studentsRes.data.length > 0) {
      const suggestedTarget = getSuggestedTargetClass(sourceClass);
      const rows: StudentPromotionRow[] = studentsRes.data.map((std: StudentAdminItem) => ({
        studentId: std.id,
        fullname: std.fullname,
        nisn: std.nisn,
        action: isTerminalGrade ? "graduate" : "promote",
        targetClassId: isTerminalGrade ? undefined : suggestedTarget,
        note: "",
      }));
      setPromotionRows(rows);
    } else {
      setPromotionRows([]);
    }
  }, [studentsRes?.data, selectedSourceClassId, isTerminalGrade]);

  const handleRowChange = (index: number, field: keyof StudentPromotionRow, value: any) => {
    setPromotionRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "action" && value === "graduate") {
        updated[index].targetClassId = undefined;
      }
      return updated;
    });
  };

  const handleApplyToAll = (action: "promote" | "retain" | "graduate") => {
    const suggestedTarget = getSuggestedTargetClass(sourceClass);
    setPromotionRows((prev) =>
      prev.map((row) => ({
        ...row,
        action,
        targetClassId: action === "promote" ? suggestedTarget : undefined,
      }))
    );
  };

  const handleSubmit = async () => {
    if (!selectedSourceClassId) {
      message.error("Silakan pilih rombel asal terlebih dahulu");
      return;
    }
    if (promotionRows.length === 0) {
      message.error("Tidak ada siswa yang dipilih pada rombel ini");
      return;
    }

    try {
      await promoteStudentsMutation.mutateAsync({
        sourceClassId: selectedSourceClassId,
        targetAcademicYear,
        promotions: promotionRows.map((r) => ({
          studentId: r.studentId,
          action: r.action,
          targetClassId: r.targetClassId,
          note: r.note,
        })),
      });

      message.success(
        `Proses kenaikan kelas berhasil! ${promotionRows.length} siswa berhasil diperbarui ke T.A. ${targetAcademicYear}.`
      );
      setIsConfirmOpen(false);
      handleClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal memproses kenaikan kelas");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedSourceClassId(null);
    setPromotionRows([]);
    onCancel();
  };

  const columns = [
    {
      title: "No",
      key: "no",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Siswa",
      key: "student",
      width: 220,
      render: (_: any, record: StudentPromotionRow) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{record.fullname}</div>
          <div className="text-[11px] font-mono text-slate-500">NISN: {record.nisn}</div>
        </div>
      ),
    },
    {
      title: "Status Keputusan",
      key: "action",
      width: 160,
      render: (_: any, record: StudentPromotionRow, index: number) => (
        <Select
          value={record.action}
          onChange={(val) => handleRowChange(index, "action", val)}
          className="w-full text-xs"
          size="small"
          options={[
            { label: "Naik Kelas", value: "promote" },
            { label: "Tinggal Kelas", value: "retain" },
            { label: "Lulus (Alumni)", value: "graduate" },
          ]}
        />
      ),
    },
    {
      title: "Rombel / Kelas Tujuan",
      key: "targetClass",
      width: 180,
      render: (_: any, record: StudentPromotionRow, index: number) => {
        if (record.action === "graduate") {
          return (
            <Tag color="purple" className="text-xs">
              Lulus Pendidikan
            </Tag>
          );
        }
        if (record.action === "retain") {
          return (
            <Tag color="orange" className="text-xs">
              Tetap di {sourceClass?.name}
            </Tag>
          );
        }
        return (
          <Select
            placeholder="Pilih Kelas Tujuan"
            value={record.targetClassId}
            onChange={(val) => handleRowChange(index, "targetClassId", val)}
            className="w-full text-xs"
            size="small"
            options={classes
              .filter((c) => c.id !== selectedSourceClassId)
              .map((c) => ({ label: c.name, value: c.id }))}
          />
        );
      },
    },
    {
      title: "Catatan Perkembangan",
      key: "note",
      render: (_: any, record: StudentPromotionRow, index: number) => (
        <Input
          placeholder="Catatan hasil evaluasi (opsional)"
          value={record.note}
          onChange={(e) => handleRowChange(index, "note", e.target.value)}
          size="small"
          className="text-xs !rounded"
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <GraduationCap className="text-emerald-600" size={20} />
            <span className="font-bold text-slate-900">Alur Kenaikan Kelas & Kelulusan Siswa</span>
          </div>
        }
        open={open}
        onCancel={handleClose}
        width={920}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!selectedSourceClassId || promotionRows.length === 0}
            onClick={() => setIsConfirmOpen(true)}
            className="!bg-[#00A651] hover:!bg-[#009245] !border-none font-semibold"
          >
            Tinjau & Proses Kenaikan
          </Button>,
        ]}
        destroyOnHidden
        centered
      >
        <div className="space-y-4 pt-2">
          <Alert
            message="Petunjuk Kenaikan Kelas Akhir Tahun Ajaran"
            description="Pilih rombel asal untuk memuat daftar siswa aktif. Tentukan status apakah siswa naik kelas ke rombel tujuan, tinggal kelas, atau lulus bagi jenjang akhir."
            type="info"
            showIcon
            className="!border-emerald-200 !bg-emerald-50/70 text-xs"
          />

          {/* Form Header Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
                Pilih Rombel / Kelas Asal
              </label>
              <Select
                placeholder="Pilih Rombel Asal"
                value={selectedSourceClassId}
                onChange={(val) => setSelectedSourceClassId(val)}
                className="w-full !rounded-lg"
                options={classes.map((c) => ({
                  label: `${c.name} (${c.studentCount || 0} siswa)`,
                  value: c.id,
                }))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
                Tahun Ajaran Baru (Target)
              </label>
              <Input
                value={targetAcademicYear}
                onChange={(e) => setTargetAcademicYear(e.target.value)}
                placeholder="Contoh: 2025/2026"
                className="!rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Quick Actions Bar */}
          {selectedSourceClassId && promotionRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="text-xs text-slate-600 font-medium">
                Ditemukan <strong>{promotionRows.length}</strong> siswa aktif di {sourceClass?.name}:
              </span>
              <div className="flex gap-2">
                <Button size="small" onClick={() => handleApplyToAll("promote")} className="text-xs">
                  Semua Naik Kelas
                </Button>
                {isTerminalGrade && (
                  <Button size="small" onClick={() => handleApplyToAll("graduate")} className="text-xs">
                    Semua Lulus
                  </Button>
                )}
                <Button size="small" onClick={() => handleApplyToAll("retain")} className="text-xs">
                  Reset (Tinggal Kelas)
                </Button>
              </div>
            </div>
          )}

          {/* Table of Students */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <Table
              dataSource={promotionRows}
              columns={columns}
              rowKey="studentId"
              loading={loadingStudents}
              pagination={false}
              size="middle"
              scroll={{ y: 320 }}
              locale={{
                emptyText: selectedSourceClassId
                  ? "Tidak ada siswa aktif di rombel ini"
                  : "Silakan pilih rombel asal terlebih dahulu",
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle size={20} />
            <span className="font-bold">Konfirmasi Pemrosesan Kenaikan Kelas</span>
          </div>
        }
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onOk={handleSubmit}
        okText="Ya, Simpan Perubahan"
        cancelText="Periksa Kembali"
        okButtonProps={{
          loading: promoteStudentsMutation.isPending,
          className: "!bg-[#00A651] hover:!bg-[#009245]",
        }}
        centered
      >
        <div className="space-y-3 py-2 text-xs text-slate-600">
          <p>
            Anda akan memproses status akademik untuk <strong>{promotionRows.length} siswa</strong> dari rombel{" "}
            <strong>{sourceClass?.name}</strong> ke Tahun Ajaran <strong>{targetAcademicYear}</strong>.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span>Siswa Naik Kelas:</span>
              <strong className="text-emerald-700">
                {promotionRows.filter((r) => r.action === "promote").length} siswa
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Siswa Tinggal Kelas:</span>
              <strong className="text-amber-700">
                {promotionRows.filter((r) => r.action === "retain").length} siswa
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Siswa Dinyatakan Lulus:</span>
              <strong className="text-purple-700">
                {promotionRows.filter((r) => r.action === "graduate").length} siswa
              </strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Perubahan ini akan otomatis mencatat riwayat kenaikan di detail profil masing-masing siswa.
          </p>
        </div>
      </Modal>
    </>
  );
}
