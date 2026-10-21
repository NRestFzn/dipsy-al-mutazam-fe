import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "use-debounce";
import { Empty, Input, Pagination, Table } from "antd";
import { Search } from "lucide-react";
import { getAdminRespondenColumns } from "./columns/AdminRespondenColumn";
import { useAdminQuestionnaire } from "../../../hooks/Questionnaire/useQuestionnaire";
import type { SorterResult } from "antd/es/table/interface";
import type { Questionnaire } from "../../../types/Questionnaire/questionnaireTypes";

interface SearchInputProps {
    onSearch: (value: string) => void;
}

const SearchInput = memo(({ onSearch }: SearchInputProps) => {
    const [localText, setLocalText] = useState("");
    const [debouncedValue] = useDebounce(localText, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <Input
            prefix={<Search className="text-gray-400" size={18} />}
            placeholder="Cari judul kuesioner..."
            className="max-w-md"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            allowClear
            size="middle"
        />
    );
});

export default function Responden() {
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [finalSearch, setFinalSearch] = useState("");
    const [filters, setFilters] = useState({
        order: '[["createdAt", "desc"]]',
    });

    const {
        data: questionnaireResponse,
        isLoading,
        isFetching,
    } = useAdminQuestionnaire({
        page: pagination.current,
        pageSize: pagination.pageSize,
        title: finalSearch,
        order: filters.order,
    });

    useEffect(() => {
        setPagination((prev) => ({ ...prev, current: 1 }));
    }, [finalSearch]);

    const handleTableChange = (
        _: any,
        __: any,
        sorter: SorterResult<Questionnaire> | SorterResult<Questionnaire>[]
    ) => {
        if (!Array.isArray(sorter)) {
            const { field, order } = sorter;
            if (order) {
                const apiOrder = order === "ascend" ? "asc" : "desc";
                setFilters((prev) => ({
                    ...prev,
                    order: `[["${field}", "${apiOrder}"]]`,
                }));
            } else {
                setFilters((prev) => ({ ...prev, order: '[["createdAt", "desc"]]' }));
            }
            setPagination((prev) => ({ ...prev, current: 1 }));
        }
    };

    const columns = getAdminRespondenColumns({
        pagination,
        onSeeDetail(id) {
            navigate(`/admin-medis/responden/${id}`);
        },
    });

    const dataSource = questionnaireResponse?.data || [];
    const totalData = questionnaireResponse?.meta?.pagination?.total || 0;

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-y-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">Monitoring Responden Skrining</h1>
                    <p className="text-gray-500 text-sm">
                        Pantau rekapitulasi data skrining kesehatan mental siswa di seluruh jenjang dan tingkat SMAIT Al-Multazam
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <SearchInput onSearch={setFinalSearch} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={isLoading || isFetching}
                    pagination={false}
                    onChange={handleTableChange}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    rowClassName="hover:bg-gray-50 transition-colors"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Belum ada data kuesioner yang ditemukan"
                            />
                        ),
                    }}
                />

                <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={totalData}
                        showSizeChanger
                        onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
                        size="small"
                    />
                </div>
            </div>
        </div>
    );
}
