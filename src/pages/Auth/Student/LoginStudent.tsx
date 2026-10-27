import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Form, Input, Button, Alert } from "antd";
import { Lock, IdCard } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type { LoginStudentPayload } from "../../../types/AuthTypes/authTypes";

export default function LoginStudent() {
  const navigate = useNavigate();
  const { loginStudent, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: LoginStudentPayload) => {
    setFormError(null);
    try {
      await loginStudent(values);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login student error:", err);
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 font-sans p-4 sm:p-6 text-slate-800">
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          {/* Main Card Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Institution Brand Header */}
            <div className="pb-6 mb-6 border-b border-slate-100 flex flex-col items-start">
              <img
                src="/logo-al-multazam.png"
                alt="Logo SMAIT Al-Multazam"
                className="h-11 w-auto object-contain mb-2"
              />
              <p className="text-xs text-slate-500 font-medium">
                Sistem Skrining Kesehatan Mental Siswa
              </p>
            </div>

            {/* Title & Context */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Masuk Portal Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan 10 digit Nomor Induk Siswa Nasional (NISN) resmi Anda.
              </p>
            </div>

            {(error || formError) && (
              <Alert
                message="Gagal Masuk"
                description={formError || getErrorMessage(error)}
                type="error"
                showIcon
                className="!mb-6 !rounded-lg !border-rose-200 !bg-rose-50/70 text-xs"
              />
            )}

            <Form
              name="login_student"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="middle"
              className="space-y-4"
            >
              <Form.Item
                name="nisn"
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    NISN (10 Digit Angka)
                  </span>
                }
                rules={[
                  { required: true, message: "NISN wajib diisi" },
                  { len: 10, message: "NISN harus tepat 10 digit angka" },
                  { pattern: /^[0-9]+$/, message: "NISN hanya boleh memuat angka" },
                ]}
                className="!mb-0"
              >
                <Input
                  prefix={<IdCard className="text-slate-400 mr-2" size={17} />}
                  placeholder="Contoh: 0081234567"
                  className="!rounded-lg !py-2.5 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600 text-sm"
                  maxLength={10}
                  inputMode="numeric"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Kata Sandi
                  </span>
                }
                rules={[{ required: true, message: "Kata sandi wajib diisi" }]}
                className="!mb-2"
              >
                <Input.Password
                  prefix={<Lock className="text-slate-400 mr-2" size={17} />}
                  placeholder="Masukkan kata sandi"
                  className="!rounded-lg !py-2.5 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600 text-sm"
                />
              </Form.Item>

              <Form.Item className="!mb-0 !pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="!bg-[#00A651] hover:!bg-[#009245] !border-none !h-10 !rounded-lg !text-sm !font-semibold transition-colors text-white"
                >
                  Masuk
                </Button>
              </Form.Item>
            </Form>

            {/* Demo Account Helper */}
            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-left text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800 block mb-0.5">Akun Demo Pengujian:</span>
              <span>NISN: <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-emerald-800 font-semibold">0081234567</code></span>
              <span className="mx-1.5">•</span>
              <span>Sandi: <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-800">almultazam123</code></span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-center">
              <div className="text-slate-500">
                Belum terdaftar?{" "}
                <Link
                  to="/daftar"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Daftar akun siswa
                </Link>
              </div>
              <div className="text-slate-400">
                Portal Pengajar:{" "}
                <Link
                  to="/masuk-admin"
                  className="text-slate-600 hover:text-emerald-700 font-medium underline"
                >
                  Masuk Guru BK / Wali Kelas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grounded Institutional Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 font-normal">
        © {new Date().getFullYear()} SMAIT Al-Multazam. Sistem Informasi Konseling Siswa.
      </footer>
    </div>
  );
}
