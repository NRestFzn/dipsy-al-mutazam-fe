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
import { ArrowLeft, Filter, Home, User } from "lucide-react";
import dayjs from "dayjs";

import { adminMedisService } from "../../../../service/adminMedisService";
import { adminDesaService } from "../../../../service/adminDesaService";
import type { UserSummaryResponse } from "../../../../types/adminMedisService";

import MentalHealthChart from "../../../../components/MentalHealthChart";
import { getSubmissionsColumns, type SubmissionRow } from "../columns/SubmissionsColumn";

const { RangePicker } = DatePicker;

export default function Submissions() {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith("/admin-tu") ? "/admin-tu" : "/admin-medis";

    const params = useParams<{
        questionnaireId: string;
        gradeId?: string;
        classId?: string;
        rwId?: string;
        rtId?: string;
        userId: string;
    }>();

    const rawQ = params.questionnaireId || "";
    const questionnaireId = rawQ.includes("=") ? rawQ.split("=")[1] : rawQ;

    const rawG = params.gradeId || params.rwId || "";
    const gradeId = rawG.includes("=") ? rawG.split("=")[1] : rawG;

    const rawC = params.classId || params.rtId || "";
    const classId = rawC.includes("=") ? rawC.split("=")[1] : rawC;

    const rawU = params.userId || "";
    const userId = rawU.includes("=") ? rawU.split("=")[1] : rawU;

    const [loading, setLoading] = useState({
        init: true,
        table: false,
    });

    const [userData, setUserData] = useState<UserSummaryResponse | null>(null);
    const [questionnaireName, setQuestionnaireName] = useState<string>("-");

    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [openFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        if (questionnaireId && userId) {
            fetchInitialData();
        }
    }, [questionnaireId, userId]);

    const fetchInitialData = async () => {
        setLoading((prev) => ({ ...prev, init: true }));
        try {
            await Promise.allSettled([
                fetchContextName(),
                fetchUserSummary(),
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading((prev) => ({ ...prev, init: false }));
        }
    };

    const fetchContextName = async () => {
        try {
            const res = await adminDesaService.getMedisQuestionnaireById(questionnaireId);
            setQuestionnaireName(res?.data?.title || "Kuesioner");
        } catch {
            setQuestionnaireName("Kuesioner");
        }
    };

    const fetchUserSummary = async () => {
        try {
            const startDate = dateRange ? dateRange[0] : undefined;
            const endDate = dateRange ? dateRange[1] : undefined;

            const res = await adminMedisService.getSummaryUser(
                questionnaireId,
                gradeId,
                classId,
                userId,
                startDate,
                endDate
            );
            setUserData(res);
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
        setLoading((prev) => ({ ...prev, table: true }));
        await fetchUserSummary();
        setLoading((prev) => ({ ...prev, table: false }));
    };

    const clearFilter = async () => {
        setDateRange(null);
        setOpenFilter(false);
        setLoading((prev) => ({ ...prev, table: true }));
        try {
            const res = await adminMedisService.getSummaryUser(
                questionnaireId,
                gradeId,
                classId,
                userId
            );
            setUserData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading((prev) => ({ ...prev, table: false }));
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

    const columns = getSubmissionsColumns({
        onViewDetail: (submissionId) => {
            navigate(`${basePath}/responden/result/${submissionId}`);
        },
    });

    if (loading.init) {
        return (
            <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
                <p className="text-gray-500 text-sm">Memuat riwayat pengisian siswa...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
                <Empty description="Data Riwayat Siswa Tidak Ditemukan" />
                <Button onClick={() => navigate(-1)}>Kembali</Button>
            </div>
        );
    }

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

            <Spin spinning={loading.init}>
                <MentalHealthChart
                    overallDepressionRate={userData.summarize.unStableMentalPercentage || 0}
                    totalSubmit={userData.summarize.submitCount || 0}
                    submissionsData={userData.submissions as any[]}
                    title={`Riwayat Skrining: ${userData.fullname}`}
                    subtitle={`Perkembangan skor skrining instrumen ${questionnaireName}`}
                />
            </Spin>

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
                                        {questionnaireName}
                                    </Link>
                                ),
                            },
                            {
                                title: <span className="font-semibold text-gray-800">{userData.fullname}</span>,
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
                        <User size={18} className="text-[#00A651]" />
                        <span>Daftar Pengisian Kuesioner</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        Total: {userData.submissions?.length || 0} Kali Pengisian
                    </span>
                </div>

                <Table
                    columns={columns}
                    dataSource={userData.submissions as SubmissionRow[]}
                    rowKey="submissionId"
                    loading={loading.table}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} Pengisian`,
                    }}
                    scroll={{ x: 800 }}
                    rowClassName="hover:bg-gray-50 transition-colors"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Siswa belum memiliki riwayat pengisian kuesioner ini"
                            />
                        ),
                    }}
                />
            </div>
        </div>
    );
}
