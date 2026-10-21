import { useNavigate } from "react-router";
import {
  Avatar,
  Tag,
  Descriptions,
  Button,
  Skeleton,
  Result,
} from "antd";
import { ArrowLeft, Edit, Camera, GraduationCap, User as UserIcon } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";

import { useState } from "react";
import EditProfileModal from "./Partials/EditModal";
import UpdatePhotoModal from "./Partials/UpdatePhotoProfile";
import { useStudent } from "../../../hooks/useStudent";
import { getImageUrl } from "../../../utils/imageHelper";

export default function Profile() {
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useStudent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 font-sans">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Result
          status="error"
          title="Gagal Memuat Profil"
          subTitle="Terjadi kendala saat mengambil data profil siswa."
          extra={[
            <Button
              type="primary"
              onClick={() => refetch()}
              key="retry"
              className="!bg-[#00A651] hover:!bg-[#009245] !rounded-lg text-xs"
            >
              Coba Lagi
            </Button>,
            <Button
              onClick={() => navigate("/")}
              key="home"
              className="!rounded-lg text-xs"
            >
              Kembali ke Beranda
            </Button>,
          ]}
        />
      </div>
    );
  }

  const profile = response.data;
  const profilePictureUrl = getImageUrl(profile.profilePicture);
  const userDetail = profile.userDetail;

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-800">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            type="text"
            onClick={() => navigate("/")}
            className="!text-slate-600 hover:!bg-slate-200/60 font-medium flex items-center gap-1.5 px-2 text-xs !rounded-lg"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Button>
          <Button
            icon={<Edit size={14} />}
            onClick={() => setIsEditModalOpen(true)}
            className="!bg-white !border-slate-300 hover:!border-emerald-600 !text-slate-700 hover:!text-emerald-700 !rounded-lg text-xs font-semibold"
          >
            Edit Profil
          </Button>
        </div>

        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Avatar
                  size={96}
                  src={profilePictureUrl}
                  className="bg-emerald-100 text-emerald-800 font-bold text-3xl border-2 border-slate-200 shadow-sm"
                >
                  {profile.fullname.charAt(0).toUpperCase()}
                </Avatar>
                <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                  <h1 className="text-xl font-bold text-slate-900 leading-snug">
                    {profile.fullname}
                  </h1>
                  <Tag className="!m-0 !w-fit mx-auto sm:mx-0 !bg-emerald-50 !text-emerald-700 !border-emerald-200 !text-[11px] !font-semibold !rounded">
                    Siswa Aktif
                  </Tag>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  {profile.email || "Email belum didaftarkan"}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      NISN
                    </span>
                    <span className="font-mono font-medium text-slate-800">
                      {userDetail?.nisn || "-"}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Terdaftar Sejak
                    </span>
                    <span className="font-medium text-slate-800">
                      {userDetail?.createdAt
                        ? dayjs(userDetail.createdAt).locale("id").format("DD MMM YYYY")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Informasi Akademik
              </h2>
            </div>
            <div className="p-5">
              <Descriptions
                column={1}
                size="small"
                layout="horizontal"
                labelStyle={{ width: "160px", color: "#64748b", fontSize: "12px", fontWeight: 500 }}
                contentStyle={{ color: "#1e293b", fontSize: "12px", fontWeight: 600 }}
              >
                <Descriptions.Item label="Jenjang / Tingkat">
                  {userDetail?.gradeLevel?.name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Rombongan Belajar (Kelas)">
                  {userDetail?.classroom?.name || "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <UserIcon size={16} className="text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Data Pribadi
              </h2>
            </div>
            <div className="p-5">
              <Descriptions
                column={1}
                size="small"
                layout="horizontal"
                labelStyle={{ width: "160px", color: "#64748b", fontSize: "12px", fontWeight: 500 }}
                contentStyle={{ color: "#1e293b", fontSize: "12px", fontWeight: 600 }}
              >
                <Descriptions.Item label="Jenis Kelamin">
                  {userDetail?.gender === "m" ? "Laki-Laki" : userDetail?.gender === "f" ? "Perempuan" : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Lahir">
                  {userDetail?.birthDate
                    ? dayjs(userDetail.birthDate).locale("id").format("DD MMMM YYYY")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Nomor Telepon / WhatsApp">
                  {userDetail?.phoneNumber || "-"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>

        <EditProfileModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={profile}
        />

        <UpdatePhotoModal
          open={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          currentPhotoUrl={profilePictureUrl}
          fullname={profile.fullname}
        />
      </main>
    </div>
  );
}
