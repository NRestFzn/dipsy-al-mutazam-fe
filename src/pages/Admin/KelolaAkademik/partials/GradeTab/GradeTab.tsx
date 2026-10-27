import { useState } from "react";
import { Input, Table } from "antd";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { getGradeColumns } from "../../columns/GradeColumn";
import { useAcademic } from "../../../../../hooks/Admin/useAcademic";
import type { SorterResult } from "antd/es/table/interface";
import type { GradeItem } from "../../../../../types/Academic/academicTypes";

export default function GradeTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filters, setFilters] = useState({ order: '[["name", "asc"]]' });

  const { useGrades } = useAcademic();
  const { data: response, isLoading } = useGrades({
    page: pagination.page,
    pageSize: pagination.pageSize,
    order: filters.order,
    name: debouncedSearch || undefined,
  });

  const handleTableChange = (
    _: any,
    __: any,
    sorter: SorterResult<GradeItem> | SorterResult<GradeItem>[]
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

  const dataSource = response?.data || [];
  const total = response?.meta?.pagination?.total || dataSource.length;

  const columns = getGradeColumns({ pagination });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Cari tingkat (contoh: X)..."
          prefix={<Search className="text-slate-400" size={16} />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          allowClear
          className="w-full sm:w-72 !rounded-lg text-sm"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table<GradeItem>
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
    </div>
  );
}
