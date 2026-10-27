import { useNavigate, useParams } from "react-router";
import {
  Card,
  Avatar,
  Tag,
  Descriptions,
  Button,
  Skeleton,
  Result,
  Grid,
} from "antd";
import {
  ArrowLeft,
  GraduationCap,
  Phone,
  Calendar,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useAcademic } from "../../../../hooks/Admin/useAcademic";

const { useBreakpoint } = Grid;

export default function PreviewStudent() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const screens = useBreakpoint();
  const descriptionLayout = screens.md ? "horizontal" : "vertical";
  const labelStyle = screens.md ? { width: "200px", color: "#64748b" } : { color: "#64748b" };

  const { useStudentDetail } = useAcademic();
  const { data: response, isLoading, isError } = useStudentDetail(studentId || null);

  const student = response?.data;

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton.Node active style={{ width: "100%", height: 180, borderRadius: 12 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Result
          status="error"
          title="Data Siswa Tidak Ditemukan"
          subTitle="Data siswa yang Anda cari tidak tersedia atau telah dihapus."
          extra={
            <Button
              type="primary"
              onClick={() => navigate("/admin/kelola-akademik")}
              className="!bg-[#70B748] hover:!bg-[#5e9e3b] !rounded-lg"
            >
              Kembali ke Kelola Akademik
            </Button>
          }
        />
      </div>
    );
  }

  const isMale = student.gender === "m";

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate("/admin/kelola-akademik")}
          className="hover:!bg-slate-100 !rounded-lg text-slate-600"
        >
          Kembali
        </Button>
        <span className="text-sm font-semibold text-slate-700">Detail Akademik Siswa</span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar
            size={72}
            className={`font-bold text-xl shrink-0 ${
              isMale ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {student.fullname?.charAt(0)?.toUpperCase() || "S"}
          </Avatar>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {student.fullname}
              </h1>
              <Tag
                color={isMale ? "blue" : "magenta"}
                className="!rounded-md text-xs font-semibold inline-flex items-center gap-1"
              >
                {isMale ? <BsGenderMale /> : <BsGenderFemale />}
                {isMale ? "Laki-laki" : "Perempuan"}
              </Tag>
              <Tag color="emerald" className="!rounded-md text-xs font-semibold">
                Siswa Aktif
              </Tag>
            </div>

            <p className="text-xs text-slate-500 font-mono">
              NISN: <span className="font-semibold text-slate-700">{student.nisn}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Detail Descriptions Card */}
      <Card className="!rounded-xl border-slate-200 shadow-sm overflow-hidden" title="Data Akademik & Pribadi">
        <Descriptions
          bordered
          column={1}
          size="middle"
          layout={descriptionLayout}
          labelStyle={labelStyle}
          className="rounded-lg overflow-hidden"
        >
          <Descriptions.Item
            label={
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <GraduationCap size={15} /> Tingkat / Jenjang
              </span>
            }
          >
            <span className="font-semibold text-slate-900">
              {student.gradeLevel?.name || "Belum ditentukan"}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <ShieldCheck size={15} /> Rombel / Kelas
              </span>
            }
          >
            <Tag color="cyan" className="font-semibold !rounded-md">
              {student.classroom?.name || "Belum ditentukan"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Calendar size={15} /> Tanggal Lahir
              </span>
            }
          >
            <span className="text-slate-800">
              {student.birthDate
                ? dayjs(student.birthDate).locale("id").format("D MMMM YYYY")
                : "-"}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Phone size={15} /> Nomor Telepon / WA
              </span>
            }
          >
            <span className="text-slate-800">{student.phoneNumber || "-"}</span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Mail size={15} /> Email Siswa
              </span>
            }
          >
            <span className="text-slate-800">{student.email || "-"}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
