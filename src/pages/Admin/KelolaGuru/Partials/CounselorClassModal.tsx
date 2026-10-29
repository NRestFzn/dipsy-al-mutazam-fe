import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Checkbox,
  Empty,
  Input,
  Modal,
  Select,
  Spin,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  Calendar,
  CheckCheck,
  GraduationCap,
  RotateCcw,
  Search,
} from "lucide-react";
import { counselorAssignmentService } from "../../../../service/Admin/counselorAssignmentService";
import { academicService } from "../../../../service/Admin/academicService";
import type { TeacherItem } from "../../../../types/Teacher/teacherTypes";
import type { ClassItem, GradeItem } from "../../../../types/Academic/academicTypes";
import {
  getAcademicYearOptions,
  isValidAcademicYear,
} from "../../../../utils/academicYear";
import { useCurrentAcademicYear } from "../../../../hooks/Admin/useCurrentAcademicYear";

interface CounselorClassModalProps {
  open: boolean;
  counselor: TeacherItem | null;
  initialAcademicYear?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface GradeClassGroup {
  id: string;
  name: string;
  classes: ClassItem[];
}

export default function CounselorClassModal({
  open,
  counselor,
  initialAcademicYear,
  onClose,
  onSuccess,
}: CounselorClassModalProps) {
  const queryClient = useQueryClient();

  const { academicYear: serverAcademicYear } = useCurrentAcademicYear();
  const [academicYear, setAcademicYear] = useState<string>(
    initialAcademicYear || serverAcademicYear
  );
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [classSearch, setClassSearch] = useState<string>("");

  // Sync initial academic year when modal opens or initialAcademicYear changes
  useEffect(() => {
    if (open) {
      setAcademicYear(initialAcademicYear || serverAcademicYear);
      setClassSearch("");
    }
  }, [open, initialAcademicYear, serverAcademicYear]);

  // Fetch classes and grades
  const { data: classesData, isLoading: isClassesLoading } = useQuery({
    queryKey: ["academic", "classes", "all"],
    queryFn: () => academicService.getClasses({ pageSize: 150 }),
    enabled: open,
  });

  const { data: gradesData, isLoading: isGradesLoading } = useQuery({
    queryKey: ["academic", "grades", "all"],
    queryFn: () => academicService.getGrades({ pageSize: 50 }),
    enabled: open,
  });

  // Fetch counselor assignments for the selected academic year
  const isYearValid = isValidAcademicYear(academicYear);
  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = useQuery({
    queryKey: ["counselor-assignments", counselor?.id, academicYear],
    queryFn: () =>
      counselorAssignmentService.getAssignments({
        UserId: counselor!.id,
        academicYear: academicYear.trim(),
      }),
    enabled: open && !!counselor?.id && isYearValid,
  });

  // Whenever assignments finish fetching for the current academic year, update selectedClassIds
  useEffect(() => {
    if (assignments) {
      const ids = assignments.map((item) => item.ClassId);
      setSelectedClassIds(ids);
    }
  }, [assignments]);

  // Mutation to replace counselor assignments
  const replaceMutation = useMutation({
    mutationFn: async () => {
      if (!counselor) throw new Error("Guru BK tidak dipilih");
      if (!isYearValid) {
        throw new Error("Format Tahun Ajaran harus YYYY/YYYY (contoh: 2026/2027)");
      }
      return counselorAssignmentService.replaceAssignments({
        UserId: counselor.id,
        academicYear: academicYear.trim(),
        ClassIds: selectedClassIds,
      });
    },
    onSuccess: () => {
      message.success(
        `Penugasan kelas BK tahun ajaran ${academicYear} berhasil disimpan`
      );
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({
        queryKey: ["counselor-assignments", counselor?.id],
      });
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg =
        err instanceof Error ? err.message : "Gagal menyimpan penugasan kelas BK";
      message.error(errorMsg);
    },
  });

  // Group classes by Grade/Tingkat
  const gradeGroups = useMemo<GradeClassGroup[]>(() => {
    const rawClasses = classesData?.data ?? [];
    const rawGrades = gradesData?.data ?? [];

    const gradeMap = new Map<string, GradeItem>();
    rawGrades.forEach((g) => gradeMap.set(g.id, g));

    const groupMap = new Map<string, GradeClassGroup>();
    const groups: GradeClassGroup[] = [];

    rawClasses.forEach((cls) => {
      const grade = cls.grade || (cls.gradeId ? gradeMap.get(cls.gradeId) : undefined);
      const gId = grade?.id || cls.gradeId || "other";
      const gName = grade?.name || "Lainnya";

      if (!groupMap.has(gId)) {
        const newGroup: GradeClassGroup = {
          id: gId,
          name: gName,
          classes: [],
        };
        groupMap.set(gId, newGroup);
        groups.push(newGroup);
      }
      groupMap.get(gId)!.classes.push(cls);
    });

    // Sort classes inside each group naturally
    groups.forEach((g) => {
      g.classes.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
    });

    // Sort groups in educational hierarchy
    const hierarchy = [
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];

    groups.sort((a, b) => {
      const idxA = hierarchy.indexOf(a.name.toUpperCase());
      const idxB = hierarchy.indexOf(b.name.toUpperCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return groups;
  }, [classesData, gradesData]);

  // Filter groups by classSearch if user types in search
  const filteredGroups = useMemo(() => {
    const term = classSearch.trim().toLowerCase();
    if (!term) return gradeGroups;

    return gradeGroups
      .map((group) => ({
        ...group,
        classes: group.classes.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            group.name.toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.classes.length > 0);
  }, [gradeGroups, classSearch]);

  const allClasses = useMemo(() => {
    return classesData?.data ?? [];
  }, [classesData]);

  // Toggle single class
  const handleToggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  // Toggle all classes in a specific grade
  const handleToggleGradeAll = (gradeClasses: ClassItem[]) => {
    const targetIds = gradeClasses.map((c) => c.id);
    const isAllSelected = targetIds.every((id) => selectedClassIds.includes(id));

    if (isAllSelected) {
      setSelectedClassIds((prev) =>
        prev.filter((id) => !targetIds.includes(id))
      );
    } else {
      setSelectedClassIds((prev) =>
        Array.from(new Set([...prev, ...targetIds]))
      );
    }
  };

  // Quick actions: select all & clear all
  const handleSelectAll = () => {
    const allIds = allClasses.map((c) => c.id);
    setSelectedClassIds(allIds);
  };

  const handleClearAll = () => {
    setSelectedClassIds([]);
  };

  const academicYearOptions = useMemo(() => {
    const defaultOptions = getAcademicYearOptions(academicYear);
    if (academicYear && !defaultOptions.some((opt) => opt.value === academicYear)) {
      return [{ label: academicYear, value: academicYear }, ...defaultOptions];
    }
    return defaultOptions;
  }, [academicYear]);

  const isLoading =
    isClassesLoading ||
    isGradesLoading ||
    isAssignmentsLoading ||
    isAssignmentsFetching;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                Atur Kelas BK
              </span>
              <Tag color="blue" className="!rounded-md !m-0 !text-xs">
                Guru BK
              </Tag>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {counselor?.fullname} ({counselor?.email})
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={760}
      destroyOnClose
      footer={
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 text-left">
            {selectedClassIds.length === 0 ? (
              <span className="text-amber-600 font-medium">
                Guru BK tidak akan memiliki penugasan kelas pada tahun ajaran ini.
              </span>
            ) : (
              <span>
                Total <strong className="text-blue-600">{selectedClassIds.length}</strong> kelas
                terpilih.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} disabled={replaceMutation.isPending}>
              Batal
            </Button>
            <Button
              type="primary"
              onClick={() => replaceMutation.mutate()}
              loading={replaceMutation.isPending}
              disabled={!isYearValid || isAssignmentsFetching}
              className="!bg-blue-600 hover:!bg-blue-700 !border-none !font-semibold"
            >
              Simpan Penugasan
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 pt-3">
        {/* Academic Year Selection */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">
                Tahun Ajaran
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={academicYear}
                onChange={(val) => setAcademicYear(val)}
                options={academicYearOptions}
                placeholder="Pilih Tahun Ajaran"
                className="w-44 !rounded-lg"
              />
              <Tooltip title="Reset ke tahun berjalan">
                <Button
                  size="small"
                  type="text"
                  onClick={() => setAcademicYear(serverAcademicYear)}
                  icon={<RotateCcw size={14} />}
                />
              </Tooltip>
            </div>
          </div>

          {!isYearValid && (
            <Alert
              type="error"
              showIcon
              message="Format tahun ajaran tidak valid. Gunakan format YYYY/YYYY (contoh: 2026/2027)."
              className="!text-xs !py-1.5"
            />
          )}

          <p className="text-xs text-slate-500">
            Penugasan disimpan spesifik per tahun ajaran. Mengubah tahun ajaran akan
            menampilkan kelas yang ditugaskan pada tahun tersebut tanpa menimpa tahun ajaran lain.
          </p>
        </div>

        {/* Action Controls & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Cari kelas atau tingkat..."
              prefix={<Search size={15} className="text-slate-400" />}
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              allowClear
              size="small"
              className="w-full sm:w-56 !rounded-lg"
            />
            <Tag color="blue" className="!rounded-md !px-2 !py-0.5 !text-xs font-semibold">
              {selectedClassIds.length} Terpilih
            </Tag>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              size="small"
              onClick={handleSelectAll}
              icon={<CheckCheck size={14} />}
              className="!text-xs !rounded-md"
            >
              Pilih Semua
            </Button>
            <Button
              size="small"
              danger
              onClick={handleClearAll}
              className="!text-xs !rounded-md"
            >
              Kosongkan
            </Button>
          </div>
        </div>

        {/* Classes List grouped by Grade */}
        <div className="border border-slate-200 rounded-xl max-h-[50vh] overflow-y-auto p-3 space-y-3.5 bg-slate-50/40">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Spin />
              <span className="text-xs">Memuat penugasan kelas...</span>
            </div>
          ) : filteredGroups.length === 0 ? (
            <Empty
              description="Tidak ada kelas yang ditemukan"
              className="py-8"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            filteredGroups.map((group) => {
              const groupClassIds = group.classes.map((c) => c.id);
              const selectedInGroup = groupClassIds.filter((id) =>
                selectedClassIds.includes(id)
              );
              const isAllGroupSelected =
                groupClassIds.length > 0 &&
                selectedInGroup.length === groupClassIds.length;
              const isIndeterminate =
                selectedInGroup.length > 0 &&
                selectedInGroup.length < groupClassIds.length;

              return (
                <div
                  key={group.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs transition-shadow"
                >
                  {/* Grade Group Header with Helper Button */}
                  <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isAllGroupSelected}
                        indeterminate={isIndeterminate}
                        onChange={() => handleToggleGradeAll(group.classes)}
                      />
                      <span className="font-semibold text-xs sm:text-sm text-slate-800">
                        Tingkat {group.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({selectedInGroup.length}/{group.classes.length} kelas)
                      </span>
                    </div>

                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleToggleGradeAll(group.classes)}
                      className="!text-xs !p-0 !font-medium text-blue-600 hover:text-blue-700"
                    >
                      {isAllGroupSelected
                        ? `Batal Pilih Tingkat ${group.name}`
                        : `Pilih Semua Kelas Tingkat ${group.name}`}
                    </Button>
                  </div>

                  {/* Classes Grid */}
                  <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.classes.map((cls) => {
                      const isSelected = selectedClassIds.includes(cls.id);
                      return (
                        <div
                          key={cls.id}
                          onClick={() => handleToggleClass(cls.id)}
                          className={`cursor-pointer rounded-lg border px-2.5 py-2 flex items-center gap-2 transition-all select-none ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs font-semibold"
                              : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span className="text-xs truncate" title={cls.name}>
                            {cls.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
