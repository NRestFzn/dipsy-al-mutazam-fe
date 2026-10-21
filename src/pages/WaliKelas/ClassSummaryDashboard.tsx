import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

import { useSummaryClass } from "../../hooks/Questionnaire/useSubmission";
import { questionnaireService } from "../../service/Questionnaire/questionnaireService";
import { useAuth } from "../../context/AuthContext";

import MentalHealthChart from "../../components/MentalHealthChart";
import {
    getWaliKelasDashboardColumn,
    type WaliKelasStudentDataRow
} from "./Columns/waliKelasDashboardColumn";

const { RangePicker } = DatePicker;

export default function ClassSummaryDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const params = useParams<{
        questionnaireId: string;
        gradeId?: string;
        classId?: string;
        rwId?: string;
        rtId?: string;
    }>();

    const questionnaireId = params.questionnaireId;
    const gradeId = params.gradeId || params.rwId || (user?.userDetail as any)?.gradeLevelId || user?.userDetail?.RukunWargaId || "";
    const classId = params.classId || params.rtId || (user?.userDetail as any)?.classroomId || user?.userDetail?.RukunTetanggaId || "";

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [metaInfo, setMetaInfo] = useState({
        questionnaireTitle: "-",
        className: user?.userDetail?.classroom?.name || (classId ? `Kelas ${classId}` : "Kelas Binaan"),
    });

    const {
        data: response,
        isLoading,
        isFetching,
        refetch
    } = useSummaryClass({
        questionnaireId: questionnaireId || "",
        gradeId,
        classId,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
    });

    useEffect(() => {
        if (questionnaireId) {
            questionnaireService.getPublicQuestionnaireById(questionnaireId)
                .then(res => {
                    setMetaInfo(prev => ({
                        ...prev,
                        questionnaireTitle: res?.title || "Detail Kuesioner"
                    }));
                })
                .catch(() => {
                    setMetaInfo(prev => ({
                        ...prev,
                        questionnaireTitle: "Detail Kuesioner"
                    }));
                });
        }
    }, [questionnaireId]);

    const handleDateChange = (_: any, dateStrings: [string, string]) => {
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
            setDateRange(dateStrings);
        } else {
            setDateRange(null);
        }
    };

    const applyFilter = () => {
        setOpenFilter(false);
        refetch();
    };

    const clearFilter = () => {
        setDateRange(null);
        setOpenFilter(false);
        setTimeout(() => refetch(), 0);
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

    const columns = getWaliKelasDashboardColumn();
    const summaryData = response?.data;
    const studentList: WaliKelasStudentDataRow[] = (summaryData?.students || summaryData?.users || []).map((s: any) => ({
        UserId: s.UserId || s.id,
        fullname: s.fullname || s.name || "-",
        nisn: s.nisn,
        isMentalUnStable: Boolean(s.isMentalUnStable),
        lastSubmissionDate: s.lastSubmissionDate,
    }));

    if (isLoading && !summaryData) {
        return (
            <div className="flex justify-center items-center h-[60vh] flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
                <p className="text-gray-500 text-sm">Memuat data skrining kelas...</p>
            </div>
        );
    }

    if (!questionnaireId) {
        return (
            <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
                <Empty description="Kuesioner tidak ditemukan" />
                <Button onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full min-h-screen bg-gray-50 pb-20">
            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    className="flex items-center mb-4 shadow-sm hover:bg-gray-100 border-gray-200"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali
                </Button>

                {summaryData && (
                    <div className="mb-6">
                        <Spin spinning={isFetching}>
                            <MentalHealthChart
                                overallDepressionRate={summaryData?.summarize?.unStableMentalPercentage || 0}
                                totalSubmit={summaryData?.summarize?.submitCount || 0}
                                totalUser={summaryData?.summarize?.userCount || 0}
                                usersData={studentList as any[]}
                                title={`Hasil Skrining ${metaInfo.className}`}
                                subtitle={`Rekapitulasi partisipasi dan kondisi kesehatan mental siswa`}
                            />
                        </Spin>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Breadcrumb
                            items={[
                                {
                                    title: (
                                        <Link to="/admin/responden" className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                                            <Home size={14} /> Beranda Wali Kelas
                                        </Link>
                                    ),
                                },
                                {
                                    title: <span className="text-gray-600">{metaInfo.questionnaireTitle}</span>,
                                },
                                {
                                    title: <span className="font-semibold text-gray-800">{metaInfo.className}</span>,
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
                            <span>Daftar Siswa di Kelas</span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                            Total: {studentList.length} Siswa Terdaftar
                        </span>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={studentList}
                        rowKey="UserId"
                        loading={isFetching}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Siswa`,
                        }}
                        scroll={{ x: 700 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Belum ada data siswa yang mengisi kuesioner di kelas ini"
                                />
                            ),
                        }}
                        rowClassName="hover:bg-gray-50 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
