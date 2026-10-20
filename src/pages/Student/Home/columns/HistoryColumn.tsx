import type { ColumnsType } from "antd/es/table";
import { Avatar, Button } from "antd";
import dayjs from "dayjs";
import type { HistoryTableData } from "../Home";
import { User } from "lucide-react";
import { getImageUrl } from "../../../../utils/imageHelper";

interface HistoryColumnsProps {
  pagination: { page: number; pageSize: number };
  onSee: (id: string) => void;
}

export const getHistoryColumn = ({ onSee, pagination }: HistoryColumnsProps): ColumnsType<HistoryTableData> => [
  {
    title: "No",
    width: 60,
    align: "center",
    render: (_, __, index) => (
      <span className="text-xs text-slate-400 font-medium">
        {(pagination.page - 1) * pagination.pageSize + index + 1}
      </span>
    ),
  },
  {
    title: "Instrumen Kuesioner",
    dataIndex: ["questionnaire", "title"],
    key: "title",
    render: (text) => (
      <span className="font-semibold text-slate-800 text-xs">
        {text}
      </span>
    ),
  },
  {
    title: "Metode Pengisian",
    key: "submittedBy",
    width: 220,
    render: (_, record) => {
      if (record.isAssisted) {
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              src={getImageUrl(record.submittedBy?.profilePicture)}
              className="bg-blue-50 text-blue-700 border border-blue-200 shrink-0 text-xs font-bold"
              size={28}
            >
              {record.submittedBy?.fullname?.charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium leading-none">
                Didampingi oleh
              </span>
              <span className="text-xs font-medium text-slate-700 mt-0.5">
                {record.submittedBy?.fullname}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium">
          <User size={13} />
          <span>Pengisian Mandiri</span>
        </div>
      );
    },
  },
  {
    title: "Waktu Pengisian",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-700">
          {dayjs(date).format("DD MMM YYYY")}
        </span>
        <span className="text-[11px] text-slate-400">
          {dayjs(date).format("HH:mm")} WIB
        </span>
      </div>
    ),
  },
  {
    title: "Hasil Skrining",
    key: "action",
    align: "center",
    width: 130,
    render: (_, record) => (
      <Button
        size="small"
        className="!bg-slate-100 hover:!bg-emerald-50 !text-slate-700 hover:!text-emerald-700 !border-slate-200 hover:!border-emerald-300 !rounded-md text-xs font-medium"
        onClick={() => onSee(record.id)}
      >
        Buka Hasil
      </Button>
    ),
  },
];
