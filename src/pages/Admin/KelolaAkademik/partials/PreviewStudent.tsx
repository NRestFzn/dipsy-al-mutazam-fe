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
import type { AcademicHistoryItem } from "../../../../types/Academic/academicTypes";

const { useBreakpoint } = Grid;

export default function PreviewStudent() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const backPath = window.location.pathname.startsWith("/admin/siswa-saya")
    ? "/admin/siswa-saya"
    : "/admin-tu/kelola-akademik";

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
              onClick={() => navigate(backPath)}
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

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(backPath)}
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
                className="!rounded-md text-xs font-semibold !m-0"
              >
                <span className="inline-flex items-center gap-1.5 leading-none">
                  {isMale ? <BsGenderMale size={12} /> : <BsGenderFemale size={12} />}
                  {isMale ? "Laki-laki" : "Perempuan"}
                </span>
              </Tag>
              {student.studentStatus === "lulus" ? (
                <Tag color="purple" className="!rounded-md text-xs font-semibold">
                  Lulus {student.graduationYear ? `(${student.graduationYear})` : ""}
                </Tag>
              ) : student.studentStatus === "pindah" ? (
                <Tag color="orange" className="!rounded-md text-xs font-semibold">
                  Pindah
                </Tag>
              ) : (
                <Tag color="emerald" className="!rounded-md text-xs font-semibold">
                  Siswa Aktif
                </Tag>
              )}
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
                <ShieldCheck size={15} /> Kelas
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

      {/* Riwayat Akademik Card */}
      <AcademicHistorySection studentId={studentId || null} />
    </div>
  );
}

function AcademicHistorySection({ studentId }: { studentId: string | null }) {
  const { useStudentAcademicHistory } = useAcademic();
  const { data: historyRes, isLoading } = useStudentAcademicHistory(studentId);
  const histories = historyRes?.data || [];

  return (
    <Card
      className="!rounded-xl border-slate-200 shadow-sm overflow-hidden !mt-6"
      title={
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-emerald-700" />
          <span className="text-base font-bold text-slate-900">
            Riwayat Kelas & Akademik Siswa
          </span>
        </div>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : histories.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Belum ada riwayat kelas yang tercatat untuk siswa ini.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-2.5 px-3">Tahun Ajaran</th>
                <th className="py-2.5 px-3">Tingkat</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">Wali Kelas</th>
                <th className="py-2.5 px-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {histories.map((h: AcademicHistoryItem, idx: number) => (
                <tr key={h.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold font-mono text-slate-800">
                    {h.academicYear}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {h.grade?.name || "-"}
                  </td>
                  <td className="py-2.5 px-3">
                    <Tag color="cyan" className="!rounded-md font-medium text-xs">
                      {h.class?.name || "-"}
                    </Tag>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {h.homeroomTeacher?.fullname || "-"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 italic text-xs">
                    {h.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
