import { Input, Select } from "antd";
import { Search } from "lucide-react";
import type { ClassItem, GradeItem } from "../../../../../../types/Academic/academicTypes";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGrade: string | null;
  onGradeChange: (value: string | null) => void;
  selectedClass: string | null;
  onClassChange: (value: string | null) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  grades: GradeItem[];
  classes: ClassItem[];
  loadingGrades?: boolean;
  loadingClasses?: boolean;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
  grades,
  classes,
  loadingGrades,
  loadingClasses,
}: SearchFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
      {/* Search Input */}
      <Input
        placeholder="Cari siswa (Nama / NISN)..."
        prefix={<Search className="text-slate-400 mr-1" size={15} />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        className="w-full sm:w-56 !rounded-lg text-sm"
      />

      {/* Filter Status Siswa */}
      <Select
        value={selectedStatus}
        onChange={onStatusChange}
        options={[
          { label: "Siswa Aktif", value: "Aktif" },
          { label: "Alumni (Lulus)", value: "Lulus" },
          { label: "Semua Status", value: "Semua" },
        ]}
        className="w-full sm:w-36 !rounded-lg"
      />

      {/* Filter Tingkat */}
      <Select
        placeholder="Semua Tingkat"
        value={selectedGrade}
        onChange={(val) => {
          onGradeChange(val);
          onClassChange(null);
        }}
        allowClear
        loading={loadingGrades}
        options={grades.map((g) => ({ label: g.name, value: g.id }))}
        className="w-full sm:w-36 !rounded-lg"
      />

      {/* Filter Kelas (Dependent) */}
      <Select
        placeholder={!selectedGrade ? "Pilih Tingkat" : "Semua Kelas"}
        value={selectedClass}
        onChange={onClassChange}
        disabled={!selectedGrade}
        allowClear
        loading={loadingClasses}
        options={classes.map((c) => ({ label: c.name, value: c.id }))}
        className="w-full sm:w-36 !rounded-lg"
      />
    </div>
  );
}
