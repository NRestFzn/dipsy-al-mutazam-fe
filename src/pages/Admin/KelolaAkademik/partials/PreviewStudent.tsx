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
  Timeline,
} from "antd";
import {
  ArrowLeft,
  GraduationCap,
  Phone,
  Calendar,
  Mail,
  ShieldCheck,
  History,
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
              className="!bg-[#00A651] hover:!bg-[#009245] !rounded-lg"
            >
              Kembali ke Kelola Akademik
            </Button>
          }
        />
      </div>
    );
  }

  const isMale = student.gender === "m";
  const isLulus = student.status === "Lulus";

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
              <Tag
                className={`!rounded-md text-xs font-semibold ${
                  isLulus
                    ? "!bg-slate-100 !text-slate-700 !border-slate-300"
                    : "!bg-emerald-50 !text-emerald-700 !border-emerald-200"
                }`}
              >
                {isLulus ? "Alumni (Lulus)" : "Siswa Aktif"}
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

      {/* Academic History Timeline Card */}
      <Card
        className="!rounded-xl border-slate-200 shadow-sm overflow-hidden"
        title={
          <div className="flex items-center gap-2">
            <History size={17} className="text-emerald-700" />
            <span className="text-sm font-bold text-slate-900">Riwayat Perjalanan Kelas & Evaluasi Akademik</span>
          </div>
        }
      >
        {student.academicHistory && student.academicHistory.length > 0 ? (
          <Timeline
            className="pt-2 !pl-2"
            items={student.academicHistory.map((h) => ({
              color: h.status === "Lulus" ? "purple" : h.status === "Naik Kelas" ? "#00A651" : "#1890ff",
              children: (
                <div className="pb-3 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{h.academicYear}</span>
                    <Tag color="cyan" className="!rounded font-medium text-xs">
                      {h.gradeName} - {h.className}
                    </Tag>
                    <Tag
                      color={
                        h.status === "Lulus"
                          ? "purple"
                          : h.status === "Naik Kelas"
                          ? "success"
                          : h.status === "Tinggal Kelas"
                          ? "warning"
                          : "blue"
                      }
                      className="!rounded text-[11px] font-semibold"
                    >
                      {h.status}
                    </Tag>
                  </div>
                  {h.homeroomTeacherName && (
                    <p className="text-xs text-slate-500">
                      Wali Kelas: <span className="text-slate-700 font-medium">{h.homeroomTeacherName}</span>
                    </p>
                  )}
                  {h.note && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{h.note}"
                    </p>
                  )}
                </div>
              ),
            }))}
          />
        ) : (
          <div className="text-xs text-slate-400 py-4 text-center">
            Belum ada catatan riwayat kelas tersimpan untuk siswa ini.
          </div>
        )}
      </Card>
    </div>
  );
}
