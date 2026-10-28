import { ArrowLeft, Filter, GraduationCap, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation, useSearchParams } from "react-router";
import type { QuestionnaireSummary, SummarizeAllResponse } from "../../../../types/adminMedisService";
import { adminDesaService } from "../../../../service/adminDesaService";
import { adminMedisService } from "../../../../service/adminMedisService";
import { counselorAssignmentService } from "../../../../service/Admin/counselorAssignmentService";
import MentalHealthChart from "../../../../components/MentalHealthChart";
import { Breadcrumb, Button, DatePicker, Empty, Popover, Select, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { getGradeDashboardColumn } from "../columns/GradeDashboardColumn";
import { getAcademicYearOptions, getCurrentAcademicYear } from "../../../../utils/academicYear";

const { RangePicker } = DatePicker;

export default function GradeDashboard() {
    const paramsId = useParams<{ questionnaireId: string }>();
    const rawParam = paramsId?.questionnaireId || "";
    const questionnaireId = rawParam.includes("=") ? rawParam.split("=")[1] : rawParam;

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const basePath = location.pathname.startsWith("/admin-tu") ? "/admin-tu" : "/admin-medis";
    const isBK = basePath === "/admin-medis";

    const urlAcademicYear = searchParams.get("academicYear");
    const [academicYear, setAcademicYear] = useState<string>(
        urlAcademicYear || getCurrentAcademicYear()
    );
    const [assignedYears, setAssignedYears] = useState<string[]>([]);

    const [loading, setLoading] = useState({
        loading: true,
        loadingTable: false,
    });
    const [summaryData, setSummaryData] = useState<QuestionnaireSummary | null>(null);
    const [questionnaireName, setQuestionnaireName] = useState<string>("-");
    const [summarizeData, setSummarizeData] = useState<SummarizeAllResponse["data"]>({
        summarize: {
            userCount: 0,
            submitCount: 0,
            stableMentalCount: 0,
            unStableMentalCount: 0,
            unStableMentalPercentage: 0,
        },
        perRw: [],
    });
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    // Fetch counselor's assigned academic years if in BK context
    useEffect(() => {
        if (isBK) {
            counselorAssignmentService.getMyAssignments()
                .then((groups) => {
                    const years = groups.map((g) => g.academicYear);
                    setAssignedYears(years);
                })
                .catch(() => {});
        }
    }, [isBK]);

    const academicYearOptions = useMemo(() => {
        const baseOptions = getAcademicYearOptions(academicYear);
        const combined = [...baseOptions];
        assignedYears.forEach((yr) => {
            if (!combined.some((opt) => opt.value === yr)) {
                combined.push({ label: yr, value: yr });
            }
        });
        return combined.sort((a, b) => b.value.localeCompare(a.value));
    }, [academicYear, assignedYears]);

    const fetchQuestionnaireName = async () => {
        if (!questionnaireId) return;
        try {
            const result = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            setQuestionnaireName(result?.data?.title || "Kuesioner");
        } catch {
            setQuestionnaireName("Kuesioner");
        }
    };

    const fetchQuestionnaireSummary = async (targetYear: string = academicYear) => {
        if (!questionnaireId) return;
        try {
            const data = await adminMedisService.getQuestionnaireSummary(questionnaireId, targetYear);
            setSummaryData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSummarizeAll = async (targetYear: string = academicYear) => {
        if (!questionnaireId) return;
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;
            const data = await adminMedisService.summarizeAll(questionnaireId, startDate, endDate, targetYear);
            setSummarizeData(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, loading: true }));
        try {
            await Promise.all([
                fetchQuestionnaireName(),
                fetchQuestionnaireSummary(academicYear),
                fetchSummarizeAll(academicYear),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading((prev) => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (questionnaireId) {
            fetchInitialData();
        }
    }, [questionnaireId]);

    const handleAcademicYearChange = async (newYear: string) => {
        setAcademicYear(newYear);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("academicYear", newYear);
            return next;
        });

        setLoading((prev) => ({ ...prev, loadingTable: true }));
        try {
            await Promise.all([
                fetchQuestionnaireSummary(newYear),
                fetchSummarizeAll(newYear),
            ]);
        } finally {
            setLoading((prev) => ({ ...prev, loadingTable: false }));
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
        await fetchSummarizeAll(academicYear);
        setLoading((prev) => ({ ...prev, loadingTable: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, loadingTable: true }));
        try {
            const res = await adminMedisService.summarizeAll(questionnaireId, undefined, undefined, academicYear);
            setSummarizeData(res.data);
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

    const columns = getGradeDashboardColumn({
        onSeeDetail: (gradeId) => {
            const queryStr = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : "";
            navigate(`${basePath}/responden/${questionnaireId}/${gradeId}${queryStr}`);
        },
    });

    if (loading.loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
                <p className="text-gray-500 text-sm">Memuat rekapitulasi data tingkat...</p>
            </div>
        );
    }

    if (!loading.loading && !summaryData) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <Empty description="Data rekapitulasi tidak ditemukan">
                    <Button onClick={() => navigate(`${basePath}/responden`)}>Kembali</Button>
                </Empty>
            </div>
        );
    }

    // Check if counselor has assignment for this academic year
    const hasNoAssignment =
        summarizeData?.hasAssignment === false || summaryData?.hasAssignment === false;

    const gradeListData = summarizeData.perRw || summaryData?.perRw || [];

    return (
        <div className="flex flex-col w-full h-full p-6 space-y-6">
            <div>
                <Button
                    type="default"
                    onClick={() => navigate(`${basePath}/responden`)}
                    className="flex items-center shadow-sm border-gray-200 hover:bg-gray-100"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali ke Daftar Kuesioner
                </Button>
            </div>

            {/* If counselor has assignments, display the mental health chart */}
            {!hasNoAssignment && summaryData && (
                <Spin spinning={loading.loadingTable}>
                    <MentalHealthChart
                        overallDepressionRate={summaryData.summarize.unStableMentalPercentage || 0}
                        totalSubmit={summaryData.summarize.submitCount || 0}
                        totalUser={summaryData.summarize.userCount || 0}
                        perGradeData={gradeListData as any[]}
                        title="Rekapitulasi Kesehatan Mental Seluruh Tingkat"
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
                                title: <span className="font-semibold text-gray-800">{questionnaireName}</span>,
                            },
                        ]}
                    />

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Filter Tahun Ajaran */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                                Tahun Ajaran:
                            </span>
                            <Select
                                value={academicYear}
                                onChange={handleAcademicYearChange}
                                options={academicYearOptions}
                                className="w-36 sm:w-40 !rounded-lg"
                            />
                        </div>

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

                {/* Empty State when Guru BK has no assignments in the selected academic year */}
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
                        dataSource={gradeListData}
                        rowKey={(record) => (record as any).gradeId || record.rwId || record.id}
                        loading={loading.loadingTable}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Tingkat`,
                        }}
                        scroll={{ x: 800 }}
                        rowClassName="hover:bg-gray-50 transition-colors"
                    />
                )}
            </div>
        </div>
    );
}
