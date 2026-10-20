import { Button, Modal, Tooltip } from "antd";
import { AlertCircle, Clock, Coffee, FileText, Heart, Info, Play } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BookOpen } from "lucide-react";

dayjs.extend(duration);

interface WelcomeHeaderProps {
  fullname: string;
}

export const WelcomeHeader = ({ fullname }: WelcomeHeaderProps) => {
  const currentHour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (currentHour >= 11 && currentHour < 15) greeting = "Selamat Siang";
  else if (currentHour >= 15 && currentHour < 18) greeting = "Selamat Sore";
  else if (currentHour >= 18) greeting = "Selamat Malam";

  const firstName = fullname?.split(" ")[0] || "Siswa";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block mb-2">
            Portal Bimbingan Konseling
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {firstName}
          </h1>
        </div>
        <div className="text-xs text-slate-400 font-medium md:text-right">
          {dayjs().locale("id").format("dddd, D MMMM YYYY")}
        </div>
      </div>
      <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
        Kuesioner ini dirancang untuk memantau kesehatan mental dan kesejahteraan emosional siswa. Hasil pengisian akan digunakan oleh Guru BK dan Wali Kelas untuk memberikan pendampingan akademik maupun personal yang tepat.
      </p>
    </div>
  );
};

interface AttentionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AttentionModal = (props: AttentionModalProps) => {
  const { open, onClose, onConfirm } = props;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
          <Info size={18} className="text-emerald-600" />
          <span className="text-base font-bold">Petunjuk Pengisian Kuesioner</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} className="!rounded-lg text-sm">
          Nanti Saja
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="!bg-[#70B748] hover:!bg-[#5e9e3b] !rounded-lg text-sm font-semibold !border-none"
          onClick={onConfirm}
        >
          Mulai Mengerjakan
        </Button>,
      ]}
      centered
      width={480}
    >
      <div className="py-4 space-y-4 text-slate-700 text-sm">
        <p className="text-slate-600 text-xs">
          Sebelum mulai mengisi, mohon perhatikan hal-hal berikut agar hasil skrining akurat dan bermanfaat:
        </p>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Coffee size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Kondisi Tenang</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Pilih tempat yang nyaman dan pastikan kamu tidak terburu-buru saat menjawab.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Heart size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Jawab Sesuai Keadaan</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Tidak ada jawaban benar atau salah. Pilihlah opsi yang paling menggambarkan kondisimu selama 30 hari terakhir.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <FileText size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Kerahasiaan Terjaga</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Seluruh data jawaban dilindungi dan hanya digunakan oleh Guru BK & Wali Kelas demi pendampingan belajar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface QuestionnaireCardProps {
  id: string;
  title: string;
  description: string;
  disabled: boolean;
  availableAt: string | null;
  category?: string;
  onStart: (id: string) => void;
  onRefresh: () => void;
}

export const QuestionnaireCard = ({
  id,
  title,
  description,
  onStart,
  disabled,
  availableAt,
  category,
  onRefresh,
}: QuestionnaireCardProps) => {
  const [timerString, setTimerString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (disabled || !availableAt) return;

    const updateTimer = () => {
      const now = dayjs();
      const target = dayjs(availableAt);
      const diff = target.diff(now);

      if (diff <= 0) {
        onRefresh();
        return;
      }

      const dur = dayjs.duration(diff);
      if (dur.asYears() >= 1) setTimerString(`${Math.floor(dur.asYears())} Tahun`);
      else if (dur.asMonths() >= 1) {
        const days = Math.floor(dur.asDays() % 30);
        setTimerString(`${Math.floor(dur.asMonths())} Bulan ${days > 0 ? `${days} Hari` : ""}`);
      } else if (dur.asWeeks() >= 1) {
        const days = Math.floor(dur.asDays() % 7);
        setTimerString(`${Math.floor(dur.asWeeks())} Minggu ${days > 0 ? `${days} Hari` : ""}`);
      } else if (dur.asDays() >= 1) {
        setTimerString(`${Math.floor(dur.asDays())} Hari ${dur.hours() > 0 ? `${dur.hours()} Jam` : ""}`);
      } else {
        const h = Math.floor(dur.asHours());
        const m = dur.minutes();
        const s = dur.seconds();
        const parts = [];
        if (h > 0) parts.push(`${h}j`);
        if (m > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        setTimerString(parts.join(" "));
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [disabled, availableAt, onRefresh]);

  const handleCardClick = () => {
    if (disabled) setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    setIsModalOpen(false);
    onStart(id);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-colors hover:border-slate-300">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200/70 text-slate-700">
            <BookOpen size={13} className="text-slate-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {category || "Umum"}
            </span>
          </div>

          {disabled ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Tersedia
            </span>
          ) : (
            <Tooltip title="Anda baru saja menyelesaikan kuesioner ini. Harap menunggu jadwal berikutnya.">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 cursor-help">
                <AlertCircle size={12} />
                Masa Tenggang
              </span>
            </Tooltip>
          )}
        </div>

        <div className="flex-1 mb-5">
          <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {description || "Tidak ada deskripsi tambahan untuk instrumen kuesioner ini."}
          </p>
        </div>

        <Button
          type="primary"
          disabled={!disabled}
          onClick={handleCardClick}
          className={`!w-full !h-10 !rounded-lg !text-xs !font-semibold !border-none transition-colors ${
            disabled
              ? "!bg-[#70B748] hover:!bg-[#5e9e3b] !text-white"
              : "!bg-slate-100 !text-slate-400 cursor-not-allowed"
          }`}
        >
          {disabled ? (
            <span className="flex items-center justify-center gap-1.5">
              <Play size={14} />
              Mulai Pengerjaan
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <Clock size={14} />
              Tersedia Dalam: {timerString || "Menghitung..."}
            </span>
          )}
        </Button>
      </div>

      <AttentionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStart}
      />
    </>
  );
};
