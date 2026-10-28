import { useState } from "react";
import { useNavigate } from "react-router";
import { Table, Button, Modal, message } from "antd";
import { Plus, GraduationCap } from "lucide-react";
import { useDebounce } from "use-debounce";
import { getStudentColumns } from "../../columns/StudentColumn";
import { SearchFilter } from "./partials/SearchFilter";
import CreateStudentModal from "../CreateStudentModal";
import UpdateStudentModal from "../UpdateStudentModal";
import PromotionModal from "../PromotionModal";
import { useAcademic } from "../../../../../hooks/Admin/useAcademic";
import type { SorterResult } from "antd/es/table/interface";
import type { StudentAdminItem } from "../../../../../types/Academic/academicTypes";

export default function StudentTab() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("aktif");

  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAdminItem | null>(null);

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filters, setFilters] = useState({ order: '[["fullname", "asc"]]' });

  const {
    useGrades,
    useClasses,
    useStudentsAdmin,
    deleteStudentMutation,
  } = useAcademic();

  const { data: gradesRes, isLoading: loadingGrades } = useGrades({ pageSize: 50 });
  const gradesList = gradesRes?.data || [];

  const { data: classesRes, isLoading: loadingClasses } = useClasses({
    gradeId: selectedGrade || undefined,
    pageSize: 50,
  });
  const classesList = classesRes?.data || [];

  const { data: studentsRes, isLoading: loadingStudents } = useStudentsAdmin({
    page: pagination.page,
    pageSize: pagination.pageSize,
    fullname: debouncedSearch || undefined,
    gradeLevelId: selectedGrade || undefined,
    classroomId: selectedClass || undefined,
    status: selectedStatus,
    order: filters.order,
  });

  const handleDetail = (record: StudentAdminItem) => {
    navigate(`/admin-tu/kelola-akademik/preview-siswa/${record.id}`);
  };

  const handleEdit = (record: StudentAdminItem) => {
    setSelectedStudent(record);
    setIsEditOpen(true);
  };

  const handleDelete = (record: StudentAdminItem) => {
    Modal.confirm({
      title: "Hapus Data Siswa",
      content: `Apakah Anda yakin ingin menghapus data siswa "${record.fullname}" (${record.nisn})?`,
      okText: "Ya, Hapus",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteStudentMutation.mutateAsync(record.id);
          message.success(`Data siswa ${record.fullname} berhasil dihapus!`);
        } catch (err: any) {
          message.error(err?.message || "Gagal menghapus siswa");
        }
      },
    });
  };

  const handleTableChange = (
    _: any,
    __: any,
    sorter: SorterResult<StudentAdminItem> | SorterResult<StudentAdminItem>[]
  ) => {
    if (!Array.isArray(sorter)) {
      const { field, order } = sorter;
      if (order) {
        const dir = order === "ascend" ? "asc" : "desc";
        setFilters({ order: `[["${field}", "${dir}"]]` });
      } else {
        setFilters({ order: '[["fullname", "asc"]]' });
      }
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const dataSource = studentsRes?.data || [];
  const total = studentsRes?.meta?.pagination?.total || dataSource.length;

  const columns = getStudentColumns({
    pagination,
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          selectedGrade={selectedGrade}
          onGradeChange={(val) => {
            setSelectedGrade(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          selectedClass={selectedClass}
          onClassChange={(val) => {
            setSelectedClass(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          grades={gradesList}
          classes={classesList}
          loadingGrades={loadingGrades}
          loadingClasses={loadingClasses}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => {
            setSelectedStatus(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            icon={<GraduationCap size={16} />}
            onClick={() => setIsPromotionOpen(true)}
            className="w-full sm:w-auto !border-[#00A651] !text-[#00A651] hover:!border-[#009245] hover:!text-[#009245] !rounded-lg text-sm font-semibold"
          >
            Kenaikan Kelas
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto !bg-[#00A651] hover:!bg-[#009245] !rounded-lg text-sm font-semibold !border-none"
          >
            Tambah Siswa
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table<StudentAdminItem>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loadingStudents}
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
      <CreateStudentModal
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
      />

      <UpdateStudentModal
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      <PromotionModal
        open={isPromotionOpen}
        onCancel={() => setIsPromotionOpen(false)}
        initialGradeId={selectedGrade}
        initialClassId={selectedClass}
      />
    </div>
  );
}
