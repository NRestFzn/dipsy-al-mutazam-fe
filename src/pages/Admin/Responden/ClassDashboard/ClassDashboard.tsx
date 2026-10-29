import { ArrowLeft, Filter, GraduationCap, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation, useSearchParams } from "react-router";
import type { RWSummary } from "../../../../types/adminMedisService";
import { adminDesaService } from "../../../../service/adminDesaService";
import { adminMedisService } from "../../../../service/adminMedisService";
import MentalHealthChart from "../../../../components/MentalHealthChart";
import { Breadcrumb, Button, DatePicker, Empty, Popover, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { getClassDashboardColumns } from "../columns/ClassDashboardColumn";
import { useCurrentAcademicYear } from "../../../../hooks/Admin/useCurrentAcademicYear";

const { RangePicker } = DatePicker;

export default function ClassDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const params = useParams<{ questionnaireId: string; gradeId?: string; rwId?: string }>();
    const rawQ = params.questionnaireId || "";
    const questionnaireId = rawQ.includes("=") ? rawQ.split("=")[1] : rawQ;

    const rawG = params.gradeId || params.rwId || "";
    const gradeId = rawG.includes("=") ? rawG.split("=")[1] : rawG;

    const basePath = location.pathname.startsWith("/admin-tu") ? "/admin-tu" : "/admin-medis";

    const { academicYear: serverAcademicYear } = useCurrentAcademicYear();
    const urlAcademicYear = searchParams.get("academicYear");
    const academicYear = urlAcademicYear || serverAcademicYear;

    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false,
    });
    const [summaryData, setSummaryData] = useState<RWSummary | null>(null);
    const [questionnaireName, setQuestionnaireName] = useState<string>("-");
    const [gradeName, setGradeName] = useState<string>(`Tingkat ${gradeId || '-'}`);

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    const fetchQuestionnaireName = async () => {
        if (!questionnaireId) return;
        try {
            const result = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            setQuestionnaireName(result?.data?.title || "Kuesioner");
        } catch {
            setQuestionnaireName("Kuesioner");
        }
    };

    const fetchGradeContext = async () => {
        if (!questionnaireId || !gradeId) return;
        try {
            const parentSummary = await adminMedisService.getQuestionnaireSummary(questionnaireId, academicYear);
            const foundGrade = parentSummary.perRw.find((r) => r.rwId === gradeId || r.id === gradeId);
            if (foundGrade) {
                const raw = foundGrade.rwName || foundGrade.name;
                setGradeName(String(raw).startsWith("Tingkat") ? String(raw) : `Tingkat ${raw}`);
            } else {
                setGradeName(`Tingkat ${gradeId}`);
            }
        } catch {
            setGradeName(`Tingkat ${gradeId}`);
        }
    };

    const fetchGradeSummary = async () => {
        if (!questionnaireId || !gradeId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const data = await adminMedisService.summaryGrade(
                questionnaireId,
                gradeId,
                startDate,
                endDate,
                academicYear
            );
            setSummaryData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, loading: true }));
        try {
            await Promise.allSettled([
                fetchQuestionnaireName(),
                fetchGradeContext(),
                fetchGradeSummary(),
            ]);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (questionnaireId && gradeId) {
            fetchInitialData();
        } else {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    }, [questionnaireId, gradeId, academicYear]);

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
        await fetchGradeSummary();
        setLoading((prev) => ({ ...prev, loadingTable: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }));
        try {
            const data = await adminMedisService.summaryGrade(questionnaireId, gradeId, undefined, undefined, academicYear);
            setSummaryData(data);
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

    const columns = getClassDashboardColumns({
        onSeeDetail: (classId) => {
            const queryStr = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : "";
            navigate(`${basePath}/responden/${questionnaireId}/${gradeId}/${classId}${queryStr}`);
        },
    });

    if (loading.loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
                <p className="text-gray-500 text-sm">Memuat rekapitulasi data kelas...</p>
            </div>
        );
    }

    if (!gradeId || !questionnaireId) {
        return (
            <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
                <Empty description="Data Tingkat Tidak Ditemukan" />
                <Button onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

    const hasNoAssignment = summaryData?.hasAssignment === false;
    const classListData = (summaryData as any)?.perClass || summaryData?.perRt || [];
    const parentDashboardUrl = `${basePath}/responden/${questionnaireId}${academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : ""}`;

    return (
        <div className="flex flex-col w-full h-full p-6 space-y-6">
            <div>
                <Button
                    type="default"
                    onClick={() => navigate(parentDashboardUrl)}
                    className="flex items-center shadow-sm border-gray-200 hover:bg-gray-100"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali ke Rekap Tingkat
                </Button>
            </div>

            {!hasNoAssignment && summaryData && (
                <Spin spinning={loading.loadingTable}>
                    <MentalHealthChart
                        overallDepressionRate={summaryData?.summarize?.unStableMentalPercentage || 0}
                        totalSubmit={summaryData?.summarize?.submitCount || 0}
                        totalUser={summaryData?.summarize?.userCount || 0}
                        perClassData={classListData as any[]}
                        title={`Rekapitulasi Kesehatan Mental ${gradeName}`}
                        subtitle={`Instrumen: ${questionnaireName} (Tahun Ajaran ${academicYear})`}
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
                                    <Link to={parentDashboardUrl} className="text-gray-500 hover:text-green-600">
                                        {questionnaireName}
                                    </Link>
                                ),
                            },
                            {
                                title: <span className="font-semibold text-gray-800">{gradeName}</span>,
                            },
                        ]}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Tag color="blue" className="!rounded-md !px-2.5 !py-1 !text-xs font-semibold">
                            Tahun Ajaran: {academicYear}
                        </Tag>

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

                {hasNoAssignment ? (
                    <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                            <GraduationCap size={28} />
                        </div>
                        <div className="max-w-md space-y-1">
                            <h3 className="text-base font-semibold text-slate-800">
                                Belum Ada Penugasan Kelas
                            </h3>
                            <p className="text-sm text-slate-600">
                                Anda belum ditugaskan ke kelas mana pun untuk tahun ajaran ini. Hubungi Tata Usaha.
                            </p>
                        </div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={classListData}
                        rowKey={(record) => record.classId || record.rtId}
                        loading={loading.loadingTable}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Kelas`,
                        }}
                        scroll={{ x: 800 }}
                        rowClassName="hover:bg-gray-50 transition-colors"
                    />
                )}
            </div>
        </div>
    );
}
