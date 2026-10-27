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
  grades,
  classes,
  loadingGrades,
  loadingClasses,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      {/* Search Input */}
      <Input
        placeholder="Cari siswa (Nama atau NISN)..."
        prefix={<Search className="text-slate-400 mr-1" size={16} />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        className="w-full sm:w-64 !rounded-lg text-sm"
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
        className="w-full sm:w-44 !rounded-lg"
      />

      {/* Filter Kelas (Dependent) */}
      <Select
        placeholder={!selectedGrade ? "Pilih Tingkat Dulu" : "Semua Kelas"}
        value={selectedClass}
        onChange={onClassChange}
        disabled={!selectedGrade}
        allowClear
        loading={loadingClasses}
        options={classes.map((c) => ({ label: c.name, value: c.id }))}
        className="w-full sm:w-44 !rounded-lg"
      />
    </div>
  );
}
