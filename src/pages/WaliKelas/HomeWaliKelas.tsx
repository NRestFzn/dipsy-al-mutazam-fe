import { useNavigate } from "react-router";
import {
    Empty,
    Spin,
    Card,
    Statistic,
    Table,
    Pagination,
} from "antd";
import {
    Loader2,
    GraduationCap,
    Users,
    Activity,
    Info,
    FileSpreadsheet
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePublicQuestionnaire, useQuestionnaire } from "../../hooks/Questionnaire/useQuestionnaire";
import { useState } from "react";
import { getWaliKelasHistoryColumn } from "./Columns/publicQuestionnaireColumn";

export default function HomeWaliKelas() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    const {
        questionnaires,
        loading: quizLoading,
    } = useQuestionnaire();

    const {
        data: publicQuizData,
        isLoading: isTableLoading
    } = usePublicQuestionnaire({
        page: pagination.page,
        pageSize: pagination.pageSize,
    });

    const gradeId = (user?.userDetail as any)?.gradeLevelId || user?.userDetail?.RukunWargaId || "grade";
    const classId = (user?.userDetail as any)?.classroomId || user?.userDetail?.RukunTetanggaId || "class";
    const className = user?.userDetail?.classroom?.name || (user?.userDetail?.RukunTetanggaId ? `Kelas ${user?.userDetail?.RukunTetanggaId}` : "Kelas Binaan");

    const handleDetailClick = (quizId: string) => {
        navigate(`/admin/responden/${quizId}/${gradeId}/${classId}`);
    };

    const tableColumns = getWaliKelasHistoryColumn({
        onDetail: handleDetailClick,
        pagination: pagination,
    });

    if (quizLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <Spin indicator={<Loader2 className="animate-spin text-[#00A651]" size={40} />} />
                <p className="text-gray-500 font-medium">Memuat portal wali kelas...</p>
            </div>
        );
    }

    const publishedQuestionnaires = Array.isArray(questionnaires)
        ? questionnaires.filter((q) => q.status === "publish")
        : [];

    const dataSource = publicQuizData?.data || [];
    const totalData = publicQuizData?.meta?.pagination?.total || 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Banner Header Institusional */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-50 text-[#00A651] border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                                Portal Wali Kelas
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-600 text-sm font-medium">SMAIT Al-Multazam</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Selamat Datang, {user?.fullname}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                            Pantau kemajuan pengisian dan rekapitulasi hasil skrining kesehatan mental siswa khusus untuk kelas binaan Anda. Siswa mengisi kuesioner secara mandiri melalui akun masing-masing.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 self-stretch md:self-auto">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-[#00A651] shrink-0">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Kelas Binaan</p>
                            <p className="text-base font-bold text-gray-800">{className}</p>
                        </div>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-xl border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                        <Statistic
                            title={
                                <span className="text-gray-500 font-medium flex items-center gap-2 text-sm">
                                    <Activity size={16} className="text-[#00A651]" /> Kuesioner Aktif
                                </span>
                            }
                            value={publishedQuestionnaires.length}
                            suffix={<span className="text-xs font-normal text-gray-400">Instrumen</span>}
                            styles={{ content: { fontWeight: 'bold', color: '#111827', fontSize: '24px' } }}
                        />
                    </Card>

                    <Card className="rounded-xl border-gray-200 shadow-sm hover:border-emerald-300 transition-colors">
                        <Statistic
                            title={
                                <span className="text-gray-500 font-medium flex items-center gap-2 text-sm">
                                    <Users size={16} className="text-blue-600" /> Target Pemantauan
                                </span>
                            }
                            value={className}
                            styles={{ content: { fontWeight: 'bold', color: '#111827', fontSize: '22px' } }}
                        />
                    </Card>

                    <Card className="rounded-xl border-emerald-100 bg-emerald-50/50 shadow-sm flex items-center">
                        <div className="flex gap-3.5 items-start">
                            <Info className="text-[#00A651] mt-0.5 shrink-0" size={18} />
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm mb-1">Panduan Wali Kelas</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Pilih kuesioner pada tabel di bawah untuk melihat rincian persentase siswa dan daftar nama siswa yang membutuhkan perhatian lebih.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabel Hasil Kuesioner Kelas */}
                <Card
                    className="shadow-sm border-gray-200 rounded-2xl overflow-hidden !p-0"
                    styles={{ body: { padding: 0 } }}
                    title={
                        <div className="flex items-center gap-3 py-4">
                            <div className="bg-emerald-50 p-2 rounded-lg text-[#00A651]">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Instrumen Skrining Tersedia</h3>
                                <p className="text-xs text-gray-500 font-normal">Pilih kuesioner untuk meninjau rekapitulasi data siswa kelas {className}</p>
                            </div>
                        </div>
                    }
                >
                    <Table
                        columns={tableColumns}
                        dataSource={dataSource}
                        rowKey="id"
                        loading={isTableLoading}
                        pagination={false}
                        scroll={{ x: 800 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Belum ada kuesioner aktif yang diterbitkan untuk saat ini"
                                />
                            )
                        }}
                        rowClassName="hover:bg-gray-50 transition-colors"
                    />

                    <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
                        <Pagination
                            current={pagination.page}
                            pageSize={pagination.pageSize}
                            total={totalData}
                            showSizeChanger
                            onChange={(page, pageSize) => setPagination({ page, pageSize })}
                            size="small"
                        />
                    </div>
                </Card>

            </main>
        </div>
    );
}
