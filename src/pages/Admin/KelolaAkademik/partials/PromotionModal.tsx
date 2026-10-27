import { useEffect, useRef, useState } from "react";
import { Modal, Select, Input, Table, Tag, Button, message, Alert } from "antd";
import { GraduationCap, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { useAcademic } from "../../../../hooks/Admin/useAcademic";
import type { ColumnsType } from "antd/es/table";
import type { ClassItem, GradeItem, StudentAdminItem } from "../../../../types/Academic/academicTypes";

interface PromotionModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  initialGradeId?: string | null;
  initialClassId?: string | null;
}

interface StudentPromotionRow {
  studentId: string;
  fullname: string;
  nisn: string;
  action: "promote" | "retain" | "graduate";
  targetGradeId?: string | null;
  targetClassId?: string | null;
  notes?: string;
}

export default function PromotionModal({
  open,
  onCancel,
  onSuccess,
  initialGradeId,
  initialClassId,
}: PromotionModalProps) {
  const currentYear = new Date().getFullYear();
  const [academicYear, setAcademicYear] = useState<string>(`${currentYear}/${currentYear + 1}`);

  const [sourceGradeId, setSourceGradeId] = useState<string | null>(initialGradeId || null);
  const [sourceClassId, setSourceClassId] = useState<string | null>(initialClassId || null);

  const [bulkTargetGradeId, setBulkTargetGradeId] = useState<string | null>(null);
  const [bulkTargetClassId, setBulkTargetClassId] = useState<string | null>(null);

  const [promotionRows, setPromotionRows] = useState<StudentPromotionRow[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    useGrades,
    useClasses,
    useStudentsAdmin,
    promoteStudentsMutation,
    graduateStudentsMutation,
  } = useAcademic();

  // Grades list
  const { data: gradesRes, isLoading: loadingGrades } = useGrades({ pageSize: 50 });
  const gradesList: GradeItem[] = gradesRes?.data || [];

  // Source classes for selected source grade
  const { data: sourceClassesRes, isLoading: loadingSourceClasses } = useClasses({
    gradeId: sourceGradeId || undefined,
    pageSize: 100,
  });
  const sourceClassesList: ClassItem[] = sourceClassesRes?.data || [];

  // All classes across all grades (for target dropdowns)
  const { data: allClassesRes } = useClasses({ pageSize: 150 });
  const allClassesList: ClassItem[] = allClassesRes?.data || [];

  // Target classes filtered by bulkTargetGradeId
  const bulkTargetClasses = bulkTargetGradeId
    ? allClassesList.filter((c) => c.gradeId === bulkTargetGradeId)
    : allClassesList;

  // Active students in source class
  const {
    data: studentsRes,
    isLoading: loadingStudents,
    refetch: refetchStudents,
  } = useStudentsAdmin({
    classroomId: sourceClassId || undefined,
    status: "aktif",
    pageSize: 100,
  });

  // Source class & grade metadata
  const sourceClass = allClassesList.find((c) => c.id === sourceClassId);
  const sourceGrade = gradesList.find((g) => g.id === (sourceGradeId || sourceClass?.gradeId));
  const isTerminalGrade = sourceGrade?.name === "XII";

  // Sync initial props
  useEffect(() => {
    if (open) {
      if (initialGradeId) setSourceGradeId(initialGradeId);
      if (initialClassId) setSourceClassId(initialClassId);
    }
  }, [open, initialGradeId, initialClassId]);

  useEffect(() => {
    if (!initialClassId || sourceGradeId) return;

    const target = allClassesList.find((item) => item.id === initialClassId);
    if (target?.gradeId) setSourceGradeId(target.gradeId);
  }, [initialClassId, sourceGradeId, allClassesList]);

  // When source class changes, infer suggestion & populate rows
  const rowsSignature = useRef("");

  useEffect(() => {
    const students = studentsRes?.data || [];
    const signature = `${sourceClassId ?? ""}:${students.map((item) => item.id).join(",")}`;

    if (rowsSignature.current === signature) return;
    rowsSignature.current = signature;

    if (!sourceClassId) {
      setPromotionRows([]);
      return;
    }

    setPromotionRows(
      students.map((std: StudentAdminItem) => ({
        studentId: std.id,
        fullname: std.fullname,
        nisn: std.nisn,
        action: isTerminalGrade ? "graduate" : "promote",
        targetGradeId: null,
        targetClassId: null,
        notes: "",
      }))
    );
  }, [studentsRes?.data, sourceClassId, isTerminalGrade]);

  // Helper: Bulk apply target class to all 'promote' students
  const handleApplyBulkTarget = () => {
    if (!bulkTargetClassId) {
      message.warning("Pilih kelas tujuan terlebih dahulu!");
      return;
    }

    const selectedClass = allClassesList.find((c) => c.id === bulkTargetClassId);
    const resolvedGradeId = bulkTargetGradeId || selectedClass?.gradeId || null;

    setPromotionRows((prev) =>
      prev.map((row) => {
        if (row.action === "promote") {
          return {
            ...row,
            targetGradeId: resolvedGradeId,
            targetClassId: bulkTargetClassId,
          };
        }
        return row;
      })
    );

    message.success("Kelas tujuan berhasil diterapkan ke semua siswa yang naik kelas!");
  };

  // Row update helpers
  const handleRowActionChange = (
    index: number,
    newAction: "promote" | "retain" | "graduate"
  ) => {
    setPromotionRows((prev) => {
      const next = [...prev];
      const current = next[index];
      if (newAction === "graduate") {
        next[index] = {
          ...current,
          action: newAction,
          targetGradeId: null,
          targetClassId: null,
        };
      } else if (newAction === "retain") {
        next[index] = {
          ...current,
          action: newAction,
          targetGradeId: sourceGradeId || sourceClass?.gradeId || null,
          targetClassId: sourceClassId,
        };
      } else {
        next[index] = {
          ...current,
          action: newAction,
          targetGradeId: bulkTargetGradeId || null,
          targetClassId: bulkTargetClassId || null,
        };
      }
      return next;
    });
  };

  const handleRowTargetClassChange = (index: number, newClassId: string | null) => {
    const selected = allClassesList.find((c) => c.id === newClassId);
    setPromotionRows((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        targetClassId: newClassId,
        targetGradeId: selected?.gradeId || null,
      };
      return next;
    });
  };

  const handleRowNotesChange = (index: number, notes: string) => {
    setPromotionRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], notes };
      return next;
    });
  };

  // Validation before opening confirmation
  const handleValidateBeforeConfirm = () => {
    if (!academicYear || !/^\d{4}\/\d{4}$/.test(academicYear.trim())) {
      message.error("Format tahun ajaran baru harus YYYY/YYYY (contoh: 2025/2026)");
      return;
    }

    if (!sourceClassId) {
      message.error("Pilih kelas asal terlebih dahulu!");
      return;
    }

    if (promotionRows.length === 0) {
      message.warning("Tidak ada siswa aktif di kelas yang dipilih.");
      return;
    }

    // Check if any 'promote' students missing target class
    const unassignedPromote = promotionRows.filter(
      (r) => r.action === "promote" && (!r.targetClassId || !r.targetGradeId)
    );

    if (unassignedPromote.length > 0) {
      message.error(
        `Ada ${unassignedPromote.length} siswa dengan aksi 'Naik Kelas' yang belum memiliki kelas tujuan!`
      );
      return;
    }

    setIsConfirmOpen(true);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    const promoteItems = promotionRows.filter(
      (r) => r.action === "promote" || r.action === "retain"
    );
    const graduateItems = promotionRows.filter((r) => r.action === "graduate");

    const isSubmitting =
      promoteStudentsMutation.isPending || graduateStudentsMutation.isPending;
    if (isSubmitting) return;

    try {
      // 1. Process promotions & retentions
      if (promoteItems.length > 0) {
        await promoteStudentsMutation.mutateAsync({
          academicYear: academicYear.trim(),
          promotions: promoteItems.map((r) => ({
            studentId: r.studentId,
            targetGradeId: r.targetGradeId!,
            targetClassId: r.targetClassId!,
            notes: r.notes?.trim() ? r.notes.trim() : null,
          })),
        });
      }

      // 2. Process graduations
      if (graduateItems.length > 0) {
        const gradYear =
          academicYear.split("/")[1]?.trim() || academicYear.split("/")[0]?.trim() || "2026";
        await graduateStudentsMutation.mutateAsync({
          studentIds: graduateItems.map((r) => r.studentId),
          graduationYear: gradYear,
        });
      }

      message.success("Proses kenaikan kelas & kelulusan siswa berhasil disimpan!");
      setIsConfirmOpen(false);
      onCancel();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.message || "Gagal memproses kenaikan kelas");
    }
  };

  // Table columns
  const columns: ColumnsType<StudentPromotionRow> = [
    {
      title: "No",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Nama & NISN",
      key: "student",
      width: 220,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs sm:text-sm">
            {record.fullname}
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            NISN: {record.nisn || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Tindakan",
      key: "action",
      width: 170,
      render: (_, record, idx) => (
        <Select
          size="small"
          value={record.action}
          onChange={(val) => handleRowActionChange(idx, val)}
          className="w-full text-xs font-medium"
          options={[
            {
              label: (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  Naik Kelas
                </span>
              ),
              value: "promote",
            },
            {
              label: (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  Tinggal Kelas
                </span>
              ),
              value: "retain",
            },
            {
              label: (
                <span className="text-purple-700 font-semibold flex items-center gap-1">
                  Lulus
                </span>
              ),
              value: "graduate",
            },
          ]}
        />
      ),
    },
    {
      title: "Kelas Tujuan",
      key: "targetClass",
      width: 200,
      render: (_, record, idx) => {
        if (record.action === "graduate") {
          return (
            <Tag color="purple" className="!rounded-md text-[11px]">
              Lulus
            </Tag>
          );
        }
        if (record.action === "retain") {
          return (
            <Tag color="orange" className="!rounded-md text-[11px]">
              Tetap di {sourceClass?.name || "Kelas Asal"}
            </Tag>
          );
        }

        return (
          <Select
            size="small"
            placeholder="Pilih Kelas Tujuan..."
            value={record.targetClassId || undefined}
            onChange={(val) => handleRowTargetClassChange(idx, val)}
            className="w-full text-xs"
            showSearch
            optionFilterProp="label"
            options={allClassesList.map((c) => ({
              label: `${c.grade?.name ? `[${c.grade.name}] ` : ""}${c.name}`,
              value: c.id,
            }))}
          />
        );
      },
    },
    {
      title: "Catatan (Opsional)",
      key: "notes",
      render: (_, record, idx) => (
        <Input
          size="small"
          placeholder="Catatan tambahan (opsional)"
          value={record.notes}
          onChange={(e) => handleRowNotesChange(idx, e.target.value)}
          className="text-xs !rounded"
        />
      ),
    },
  ];

  // Summary counts for confirmation modal
  const countPromote = promotionRows.filter((r) => r.action === "promote").length;
  const countRetain = promotionRows.filter((r) => r.action === "retain").length;
  const countGraduate = promotionRows.filter((r) => r.action === "graduate").length;

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        width={960}
        footer={null}
        destroyOnHidden
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Kenaikan Kelas & Kelulusan Siswa
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Atur kenaikan kelas dan kelulusan siswa untuk tahun ajaran baru.
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-3">
          {/* Kelas asal dan tahun ajaran baru */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tingkat Asal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Tingkat Asal
                </label>
                <Select
                  placeholder="Pilih Tingkat Asal"
                  value={sourceGradeId}
                  onChange={(val) => {
                    setSourceGradeId(val);
                    setSourceClassId(null);
                  }}
                  loading={loadingGrades}
                  className="w-full !rounded-lg"
                  options={gradesList.map((g) => ({ label: g.name, value: g.id }))}
                />
              </div>

              {/* Rombel / Kelas Asal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Kelas Asal <span className="text-rose-500">*</span>
                </label>
                <Select
                  placeholder={!sourceGradeId ? "Pilih tingkat dahulu" : "Pilih Kelas Asal"}
                  value={sourceClassId}
                  onChange={(val) => setSourceClassId(val)}
                  disabled={!sourceGradeId}
                  loading={loadingSourceClasses}
                  className="w-full !rounded-lg"
                  options={sourceClassesList.map((c) => ({
                    label: `${c.name} (${c.studentCount || 0} Siswa)`,
                    value: c.id,
                  }))}
                />
              </div>

              {/* Tahun Ajaran Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Tahun Ajaran Baru <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: 2025/2026"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="!rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Quick Bulk Action Banner */}
            {sourceClassId && promotionRows.length > 0 && !isTerminalGrade && (
              <div className="pt-3 border-t border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <ArrowRight size={14} className="text-emerald-600 shrink-0" />
                  <span>Terapkan kelas tujuan untuk siswa yang naik kelas:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <Select
                    placeholder="Tingkat Tujuan"
                    value={bulkTargetGradeId}
                    onChange={(val) => {
                      setBulkTargetGradeId(val);
                      setBulkTargetClassId(null);
                    }}
                    allowClear
                    size="small"
                    className="w-36 text-xs"
                    options={gradesList.map((g) => ({ label: g.name, value: g.id }))}
                  />

                  <Select
                    placeholder="Pilih Kelas Tujuan..."
                    value={bulkTargetClassId}
                    onChange={(val) => setBulkTargetClassId(val)}
                    size="small"
                    className="w-48 text-xs"
                    showSearch
                    optionFilterProp="label"
                    options={bulkTargetClasses.map((c) => ({
                      label: `${c.grade?.name ? `[${c.grade.name}] ` : ""}${c.name}`,
                      value: c.id,
                    }))}
                  />

                  <Button
                    size="small"
                    type="primary"
                    onClick={handleApplyBulkTarget}
                    className="!bg-[#00A651] hover:!bg-[#009245] !rounded text-xs font-semibold"
                  >
                    Terapkan ke Semua
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Grade Notice */}
          {isTerminalGrade && sourceClassId && (
            <Alert
              type="info"
              showIcon
              message="Tingkat Akhir"
              description="Kelas XII adalah tingkat akhir. Aksi otomatis diarahkan ke 'Lulus', namun tetap dapat disesuaikan bila ada siswa yang tinggal kelas."
              className="!rounded-lg text-xs"
            />
          )}

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-50/70 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">
                Daftar Siswa Aktif ({promotionRows.length} Siswa)
              </span>
              {sourceClassId && (
                <Button
                  size="small"
                  type="text"
                  icon={<RefreshCw size={13} />}
                  onClick={() => refetchStudents()}
                  loading={loadingStudents}
                  className="text-slate-500 hover:text-emerald-700"
                >
                  Muat Ulang
                </Button>
              )}
            </div>

            <Table<StudentPromotionRow>
              columns={columns}
              dataSource={promotionRows}
              rowKey="studentId"
              loading={loadingStudents}
              pagination={false}
              scroll={{ y: 320 }}
              size="middle"
              locale={{
                emptyText: sourceClassId
                  ? "Tidak ada siswa aktif di kelas ini."
                  : "Silakan pilih kelas asal terlebih dahulu.",
              }}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
            <Button onClick={onCancel} className="!rounded-lg">
              Batal
            </Button>
            <Button
              type="primary"
              disabled={promotionRows.length === 0}
              onClick={handleValidateBeforeConfirm}
              className="!bg-[#00A651] hover:!bg-[#009245] !rounded-lg font-semibold"
            >
              Lanjut ke Konfirmasi ({promotionRows.length} Siswa)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        title={
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <CheckCircle2 className="text-emerald-600" size={20} />
            Konfirmasi Kenaikan Kelas & Kelulusan
          </div>
        }
        footer={[
          <Button key="back" onClick={() => setIsConfirmOpen(false)} className="!rounded-lg">
            Kembali
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={promoteStudentsMutation.isPending || graduateStudentsMutation.isPending}
            onClick={handleFinalSubmit}
            className="!bg-[#00A651] hover:!bg-[#009245] !rounded-lg font-semibold"
          >
            Simpan Perubahan
          </Button>,
        ]}
      >
        <div className="space-y-4 py-2 text-xs sm:text-sm text-slate-700">
          <p>
            Anda akan memproses kenaikan kelas untuk kelas{" "}
            <span className="font-bold text-slate-900">{sourceClass?.name}</span> menuju tahun
            ajaran baru <span className="font-bold text-slate-900">{academicYear}</span>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Ringkasan Kenaikan Kelas:
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Siswa Naik Kelas:</span>
              <Tag color="success" className="font-bold font-mono">
                {countPromote} Siswa
              </Tag>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Siswa Tinggal Kelas:</span>
              <Tag color="warning" className="font-bold font-mono">
                {countRetain} Siswa
              </Tag>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Siswa Dinyatakan Lulus:</span>
              <Tag color="purple" className="font-bold font-mono">
                {countGraduate} Siswa
              </Tag>
            </div>
          </div>

          <Alert
            type="warning"
            showIcon
            message="Perhatian"
            description="Kelas tahun ajaran sebelumnya otomatis tersimpan di riwayat akademik siswa."
            className="!rounded-lg text-xs"
          />
        </div>
      </Modal>
    </>
  );
}
