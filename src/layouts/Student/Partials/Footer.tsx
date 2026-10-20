export const HomeFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-al-multazam.png"
            alt="Logo SMAIT Al-Multazam"
            className="w-6 h-6 object-contain"
          />
          <span className="font-semibold text-slate-800">
            SMAIT Al-Multazam
          </span>
          <span className="text-slate-300">|</span>
          <span>Sistem Skrining & Bimbingan Konseling Siswa</span>
        </div>

        <div className="text-slate-400">
          © {currentYear} SMAIT Al-Multazam. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
};
