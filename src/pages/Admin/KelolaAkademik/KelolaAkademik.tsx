import { useState } from "react";
import { useLocation } from "react-router";
import { Card, Tabs, Tag } from "antd";
import { Layers, Users, BookOpenCheck } from "lucide-react";
import ClassTab from "./partials/ClassTab/ClassTab";
import StudentTab from "./partials/StudentTab/StudentTab";
import { MASTER_GRADES } from "../../../constants";

export default function KelolaAkademik() {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState<string>(state?.defaultTab ?? "1");

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Layers size={16} />
          Data Kelas (Rombel)
        </span>
      ),
      children: <ClassTab />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Users size={16} />
          Data Siswa
        </span>
      ),
      children: <StudentTab />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block">
            Manajemen Akademik Sekolah
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <BookOpenCheck size={14} className="text-emerald-600" />
            <span>Master Data Tingkat:</span>
            <div className="flex gap-1">
              {MASTER_GRADES.map((mg) => (
                <Tag key={mg.id} color="green" className="!mr-0 !text-[11px] !py-0 !px-1.5">
                  {mg.name.replace("Kelas ", "")}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kelola Akademik
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Pengelolaan rombongan belajar kelas, wali kelas pendamping, dan data induk siswa SMAIT Al-Multazam. Jenjang tingkat terstandarisasi sebagai master data baku.
        </p>
      </div>

      {/* Tabs Container */}
      <Card className="!rounded-xl border-slate-200 shadow-sm overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="academic-tabs"
        />
      </Card>
    </div>
  );
}
