import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import {
    Breadcrumb,
    Button,
    DatePicker,
    Empty,
    Popover,
    Spin,
    Table,
    Tag,
} from "antd";
import { ArrowLeft, Filter, Home, Users } from "lucide-react";
import dayjs from "dayjs";

import { adminMedisService } from "../../../../service/adminMedisService";
import { adminDesaService } from "../../../../service/adminDesaService";
import type { RTSummary } from "../../../../types/adminMedisService";
import MentalHealthChart from "../../../../components/MentalHealthChart";
import {
    getStudentDashboardColumns,
    type StudentDashboardRow,
} from "../columns/StudentDashboardColumn";

const { RangePicker } = DatePicker;

export default function StudentDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith("/admin-tu") ? "/admin-tu" : "/admin-medis";

    const params = useParams<{
        questionnaireId: string;
        gradeId?: string;
        classId?: string;
        rwId?: string;
        rtId?: string;
    }>();

    const rawQ = params.questionnaireId || "";
    const questionnaireId = rawQ.includes("=") ? rawQ.split("=")[1] : rawQ;

    const rawG = params.gradeId || params.rwId || "";
    const gradeId = rawG.includes("=") ? rawG.split("=")[1] : rawG;

    const rawC = params.classId || params.rtId || "";
    const classId = rawC.includes("=") ? rawC.split("=")[1] : rawC;

    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false,
    });

    const [summaryData, setSummaryData] = useState<RTSummary | null>(null);

    const [names, setNames] = useState({
        questionnaire: "-",
        grade: `Tingkat ${gradeId || "-"}`,
        classroom: `Kelas ${classId || "-"}`,
    });

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && gradeId && classId) {
            fetchInitialData();
        } else {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    }, [questionnaireId, gradeId, classId]);

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, loading: true }));
        try {
            await Promise.allSettled([
                fetchContextNames(),
                fetchClassSummary(),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    };

    const fetchContextNames = async () => {
        if (!questionnaireId || !gradeId || !classId) return;
        try {
            const qRes = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            const qTitle = qRes?.data?.title || "Kuesioner";

            const [gradeSummary, classSummaryRes] = await Promise.all([
                adminMedisService.getQuestionnaireSummary(questionnaireId),
                adminMedisService.summaryGrade(questionnaireId, gradeId),
            ]);

            const foundGrade = gradeSummary.perRw.find((r) => r.rwId === gradeId || r.id === gradeId);
            const gradeName = foundGrade
                ? String(foundGrade.rwName || foundGrade.name).startsWith("Tingkat")
                    ? String(foundGrade.rwName || foundGrade.name)
                    : `Tingkat ${foundGrade.rwName || foundGrade.name}`
                : `Tingkat ${gradeId}`;

            const foundClass = classSummaryRes.perRt?.find((rt) => rt.rtId === classId || (rt as any).classId === classId);
            const className = foundClass
                ? String(foundClass.rtName || (foundClass as any).className).startsWith("Kelas")
                    ? String(foundClass.rtName || (foundClass as any).className)
                    : `Kelas ${foundClass.rtName || (foundClass as any).className}`
                : `Kelas ${classId}`;

            setNames({ questionnaire: qTitle, grade: gradeName, classroom: className });
        } catch (err) {
            console.warn("Gagal mengambil nama konteks", err);
        }
    };

    const fetchClassSummary = async () => {
        if (!questionnaireId || !gradeId || !classId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const res = await adminMedisService.summaryClass(
                questionnaireId,
                gradeId,
                classId,
                startDate,
                endDate
            );
            setSummaryData(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateChange = (_: any, dateStrings: [string, string]) => {
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
            setDateRange(dateStrings);
        } else {
            setDateRange(null);
        }
    };

    const applyFilter = async () => {
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }));
        await fetchClassSummary();
        setLoading((prev) => ({ ...prev, loadingTable: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }));
        try {
            const res = await adminMedisService.summaryClass(questionnaireId, gradeId, classId);
            setSummaryData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading((prev) => ({ ...prev, loadingTable: false }));
        }
    };

    const filterContent = (
        <div className="w-80 p-2">
            <p className="mb-2 font-semibold text-gray-700 text-sm">Rentang Tanggal Pengisian</p>
            <RangePicker
                className="w-full mb-4"
                onChange={handleDateChange}
                value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button onClick={clearFilter} size="small">Reset</Button>
                <Button
                    type="primary"
                    className="!bg-[#00A651] hover:!bg-[#009245]"
                    onClick={applyFilter}
                    size="small"
                >
                    Terapkan
                </Button>
            </div>
        </div>
    );

    const columns = getStudentDashboardColumns({
        onSeeDetail: (userId) => {
            navigate(
                `${basePath}/responden/submissions/${questionnaireId}/${gradeId}/${classId}/${userId}`
            );
        },
    });

    if (loading.loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
                <p className="text-gray-500 text-sm">Memuat data skrining siswa di kelas...</p>
            </div>
        );
    }

    if (!questionnaireId || !gradeId || !classId) {
        return (
            <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
                <Empty description="Data Siswa Kelas Tidak Ditemukan" />
                <Button onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

    const studentList: StudentDashboardRow[] = (summaryData?.users || []).map((u: any) => ({
        UserId: u.UserId || u.id,
        fullname: u.fullname || "-",
        nisn: u.nisn,
        isMentalUnStable: Boolean(u.isMentalUnStable),
        lastSubmissionDate: u.lastSubmissionDate,
    }));

    return (
        <div className="flex flex-col w-full h-full p-6 space-y-6">
            <div>
                <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    className="flex items-center shadow-sm border-gray-200 hover:bg-gray-100"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali
                </Button>
            </div>

            {summaryData && (
                <Spin spinning={loading.loading}>
                    <MentalHealthChart
                        overallDepressionRate={summaryData?.summarize?.unStableMentalPercentage || 0}
                        totalSubmit={summaryData?.summarize?.submitCount || 0}
                        totalUser={summaryData?.summarize?.userCount || 0}
                        usersData={studentList as any[]}
                        title={`Hasil Skrining ${names.classroom} (${names.grade})`}
                        subtitle={`Instrumen: ${names.questionnaire}`}
                    />
                </Spin>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link to={`${basePath}/responden`} className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                                        <Home size={14} /> Beranda Responden
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link to={`${basePath}/responden/${questionnaireId}`} className="text-gray-500 hover:text-green-600">
                                        {names.questionnaire}
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link to={`${basePath}/responden/${questionnaireId}/${gradeId}`} className="text-gray-500 hover:text-green-600">
                                        {names.grade}
                                    </Link>
                                ),
                            },
                            {
                                title: <span className="font-semibold text-gray-800">{names.classroom}</span>,
                            },
                        ]}
                    />

                    <div className="flex items-center gap-2">
                        {dateRange && (
                            <Tag closable onClose={clearFilter} color="green">
                                {dateRange[0]} - {dateRange[1]}
                            </Tag>
                        )}

                        <Popover
                            content={filterContent}
                            trigger="click"
                            open={openFilter}
                            onOpenChange={setOpenFilter}
                            placement="bottomRight"
                        >
                            <Button icon={<Filter size={15} />} className="flex items-center gap-1">
                                Filter Tanggal
                            </Button>
                        </Popover>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                        <Users size={18} className="text-[#00A651]" />
                        <span>Daftar Siswa Kelas {names.classroom}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        Total: {studentList.length} Siswa Terdaftar
                    </span>
                </div>

                <Table
                    columns={columns}
                    dataSource={studentList}
                    rowKey="UserId"
                    loading={loading.loadingTable}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Siswa`,
                    }}
                    scroll={{ x: 800 }}
                    rowClassName="hover:bg-gray-50 transition-colors"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Belum ada data siswa yang mengisi di kelas ini"
                            />
                        ),
                    }}
                />
            </div>
        </div>
    );
}

