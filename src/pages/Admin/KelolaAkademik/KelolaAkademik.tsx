import { useState } from "react";
import { useLocation } from "react-router";
import { Card, Tabs } from "antd";
import { GraduationCap, Layers, Users } from "lucide-react";
import GradeTab from "./partials/GradeTab/GradeTab";
import ClassTab from "./partials/ClassTab/ClassTab";
import StudentTab from "./partials/StudentTab/StudentTab";

export default function KelolaAkademik() {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState<string>(state?.defaultTab ?? "1");

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <GraduationCap size={16} />
          Data Tingkat
        </span>
      ),
      children: <GradeTab />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <Layers size={16} />
          Data Kelas
        </span>
      ),
      children: <ClassTab />,
    },
    {
      key: "3",
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
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-2">
          Manajemen Sekolah
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kelola Akademik
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Pengelolaan struktur akademik jenjang tingkat, rombongan belajar kelas, dan data induk siswa SMAIT Al-Multazam.
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

