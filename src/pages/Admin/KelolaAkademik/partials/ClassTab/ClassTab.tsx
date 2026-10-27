import { useState } from "react";
import { Table, Button, Select, Input } from "antd";
import { Plus, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { getClassColumns } from "../../columns/ClassColumn";
import { useAcademic } from "../../../../../hooks/Admin/useAcademic";
import type { SorterResult } from "antd/es/table/interface";
import type { ClassItem } from "../../../../../types/Academic/academicTypes";
import ModalCreateClass from "./Partials/ModalCreateClass";
import ModalEditClass from "./Partials/ModalEditClass";
import ModalDeleteClass from "./Partials/ModalDeleteClass";

export default function ClassTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filters, setFilters] = useState({ order: '[["name", "asc"]]' });

  const { useGrades, useClasses } = useAcademic();

  const { data: gradesResponse } = useGrades({ pageSize: 50 });
  const gradesList = gradesResponse?.data || [];

  const { data: classesResponse, isLoading } = useClasses({
    page: pagination.page,
    pageSize: pagination.pageSize,
    gradeId: selectedGradeFilter || undefined,
    order: filters.order,
    name: debouncedSearch || undefined,
  });

  const handleEdit = (record: ClassItem) => {
    setSelectedClass(record);
    setIsEditOpen(true);
  };

  const handleDelete = (record: ClassItem) => {
    setSelectedClass(record);
    setIsDeleteOpen(true);
  };

  const handleTableChange = (
    _: any,
    __: any,
    sorter: SorterResult<ClassItem> | SorterResult<ClassItem>[]
  ) => {
    if (!Array.isArray(sorter)) {
      const { field, order } = sorter;
      if (order) {
        const dir = order === "ascend" ? "asc" : "desc";
        setFilters({ order: `[["${field}", "${dir}"]]` });
      } else {
        setFilters({ order: '[["name", "asc"]]' });
      }
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const dataSource = classesResponse?.data || [];
  const total = classesResponse?.meta?.pagination?.total || dataSource.length;

  const columns = getClassColumns({
    pagination,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Dropdown Filter Tingkat */}
          <Select
            placeholder="Semua Tingkat"
            value={selectedGradeFilter}
            onChange={(val) => {
              setSelectedGradeFilter(val);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            allowClear
            options={gradesList.map((g) => ({ label: g.name, value: g.id }))}
            className="w-full sm:w-48 !rounded-lg"
          />

          <Input
            placeholder="Cari kelas (contoh: X MIPA 1)..."
            prefix={<Search className="text-slate-400" size={16} />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            allowClear
            className="w-full sm:w-64 !rounded-lg text-sm"
          />
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto !bg-[#70B748] hover:!bg-[#5e9e3b] !rounded-lg text-sm font-semibold !border-none"
        >
          Tambah Kelas
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table<ClassItem>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
            className: "!px-4 !mb-4",
          }}
          className="rounded-xl overflow-hidden"
        />
      </div>

      {/* Modals */}
      <ModalCreateClass
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        grades={gradesList}
        defaultGradeId={selectedGradeFilter}
      />

      <ModalEditClass
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
        grades={gradesList}
      />

      <ModalDeleteClass
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedClass(null);
        }}
        classData={selectedClass}
      />
    </div>
  );
}
