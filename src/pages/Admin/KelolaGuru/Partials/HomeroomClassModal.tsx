import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Checkbox, Empty, Modal, Select, Skeleton, Tag, message } from "antd";
import { Calendar } from "lucide-react";
import { academicService } from "../../../../service/Admin/academicService";
import { useCurrentAcademicYear } from "../../../../hooks/Admin/useCurrentAcademicYear";
import { getAcademicYearOptions, isValidAcademicYear } from "../../../../utils/academicYear";
import type { ClassItem } from "../../../../types/Academic/academicTypes";
import type { TeacherItem } from "../../../../types/Teacher/teacherTypes";

interface HomeroomClassModalProps {
  open: boolean;
  teacher: TeacherItem | null;
  initialAcademicYear?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function HomeroomClassModal({
  open,
  teacher,
  initialAcademicYear,
  onClose,
  onSuccess,
}: HomeroomClassModalProps) {
  const queryClient = useQueryClient();
  const { academicYear: serverAcademicYear } = useCurrentAcademicYear();

  const [academicYear, setAcademicYear] = useState<string>(
    initialAcademicYear || serverAcademicYear
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setAcademicYear(initialAcademicYear || serverAcademicYear);
  }, [open, initialAcademicYear, serverAcademicYear]);

  const { data, isLoading } = useQuery({
    queryKey: ["academic", "classes", "homeroom-modal", academicYear],
    queryFn: () => academicService.getClasses({ pageSize: 200, academicYear }),
    enabled: open && Boolean(academicYear),
  });

  const classes: ClassItem[] = useMemo(() => data?.data || [], [data?.data]);

  useEffect(() => {
    if (!open || !teacher) return;
    setSelectedIds(
      classes
        .filter((item) => item.homeroomTeacherId === teacher.id)
        .map((item) => item.id)
    );
  }, [open, teacher?.id, classes]);

  const groups = useMemo(() => {
    const map = new Map<string, ClassItem[]>();

    classes.forEach((item) => {
      const gradeName = item.grade?.name || "-";
      if (!map.has(gradeName)) map.set(gradeName, []);
      map.get(gradeName)!.push(item);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([grade, items]) => ({
        grade,
        classes: items.slice().sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [classes]);

  const toggleClass = (classId: string) => {
    setSelectedIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const toggleGrade = (classIds: string[]) => {
    const allSelected = classIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !classIds.includes(id))
        : Array.from(new Set([...prev, ...classIds]))
    );
  };

  const handleSave = async () => {
    if (!teacher) return;

    if (!isValidAcademicYear(academicYear)) {
      message.error("Format tahun ajaran harus YYYY/YYYY");
      return;
    }

    const changes = classes.filter((item) => {
      const wasAssigned = item.homeroomTeacherId === teacher.id;
      const willAssign = selectedIds.includes(item.id);
      return wasAssigned !== willAssign;
    });

    if (changes.length === 0) {
      message.info("Tidak ada perubahan penugasan");
      onClose();
      return;
    }

    setSaving(true);

    try {
      await Promise.all(
        changes.map((item) =>
          academicService.updateClass(item.id, {
            name: item.name,
            gradeId: item.gradeId || "",
            homeroomTeacherId: selectedIds.includes(item.id) ? teacher.id : null,
            academicYear,
          })
        )
      );

      message.success("Penugasan wali kelas diperbarui");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "classes"] });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      message.error(error?.message || "Gagal menyimpan penugasan wali kelas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={720}
      title={
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-700" />
          <span>Wali Kelas — {teacher?.fullname ?? ""}</span>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          Batal
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saving}
          onClick={handleSave}
          className="!bg-[#00A651] hover:!bg-[#009245] !border-none !font-semibold"
        >
          Simpan Penugasan
        </Button>,
      ]}
    >
      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tahun Ajaran
          </label>
          <Select
            value={academicYear}
            onChange={(value) => setAcademicYear(value)}
            options={getAcademicYearOptions(serverAcademicYear)}
            className="w-full sm:w-48"
          />
        </div>

        <Alert
          type="info"
          showIcon
          message="Satu kelas hanya punya satu wali kelas per tahun ajaran"
          description="Guru boleh memegang lebih dari satu kelas. Mencentang kelas yang sudah punya wali kelas lain akan menggantinya."
          className="!rounded-lg text-xs"
        />

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : groups.length === 0 ? (
          <Empty description="Belum ada kelas pada tahun ajaran ini" />
        ) : (
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {groups.map((group) => {
              const gradeClassIds = group.classes.map((item) => item.id);
              const selectedCount = gradeClassIds.filter((id) =>
                selectedIds.includes(id)
              ).length;

              return (
                <div key={group.grade} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Tingkat {group.grade}
                    </span>

                    <Button
                      size="small"
                      type="link"
                      onClick={() => toggleGrade(gradeClassIds)}
                    >
                      {selectedCount === gradeClassIds.length
                        ? "Lepas semua"
                        : "Pilih semua"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.classes.map((item) => {
                      const checked = selectedIds.includes(item.id);
                      const otherTeacher =
                        item.homeroomTeacherId &&
                        item.homeroomTeacherId !== teacher?.id;

                      return (
                        <Checkbox
                          key={item.id}
                          checked={checked}
                          onChange={() => toggleClass(item.id)}
                        >
                          <span className="text-sm">{item.name}</span>
                          {otherTeacher && (
                            <Tag color="orange" className="ml-1 !text-[10px]">
                              sudah ada wali
                            </Tag>
                          )}
                        </Checkbox>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-xs text-slate-500">
          Terpilih: <strong>{selectedIds.length}</strong> kelas pada tahun ajaran{" "}
          <strong>{academicYear}</strong>
        </div>
      </div>
    </Modal>
  );
}
