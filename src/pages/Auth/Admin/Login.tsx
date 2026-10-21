import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Form, Input, Button, Alert } from "antd";
import { Mail, Lock} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { ROLE_ID } from "../../../constants";
import type { LoginPayload, Role } from "../../../types/AuthTypes/authTypes";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const onFinish = async (values: LoginPayload) => {
    setFormError(null);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      const userData = response?.data;
      const roles = userData?.roles || [];

      const getRedirectPath = (userRoles: Role[]) => {
        if (userRoles.some((r) => r.id === ROLE_ID.WALI_KELAS)) return "/admin/responden";
        if (userRoles.some((r) => r.id === ROLE_ID.GURU_BK)) return "/admin-medis/responden";

        return "/";
      };

      const targetPath = getRedirectPath(roles);
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 font-sans p-4 sm:p-6 text-slate-800">
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-[440px]">
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
                Portal Guru BK & Wali Kelas
              </p>
            </div>

            {/* Title & Context */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Masuk Portal Pengajar
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan email dinas atau akun pendamping konseling siswa SMAIT Al-Multazam.
              </p>
            </div>

            {(error || formError) && (
              <Alert
                message="Autentikasi Gagal"
                description={formError || getErrorMessage(error)}
                type="error"
                showIcon
                className="!mb-6 !rounded-lg !border-rose-200 !bg-rose-50/70 text-xs"
              />
            )}

            <Form
              name="login_admin"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="middle"
              className="space-y-4"
            >
              <Form.Item
                name="email"
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Alamat Email
                  </span>
                }
                rules={[
                  { required: true, message: "Alamat email wajib diisi" },
                  { type: "email", message: "Format email tidak valid" },
                ]}
                className="!mb-0"
              >
                <Input
                  prefix={<Mail className="text-slate-400 mr-2" size={17} />}
                  placeholder="nama@almultazam.sch.id"
                  className="!rounded-lg !py-2.5 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600 text-sm"
                  autoComplete="email"
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
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="!mb-0 !pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="!bg-[#00A651] hover:!bg-[#009245] !border-none !h-10 !rounded-lg !text-sm !font-semibold text-white transition-colors"
                >
                  Masuk ke Portal
                </Button>
              </Form.Item>
            </Form>

            {/* Footer Navigation */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-center">
              <div className="text-slate-500">
                Masuk sebagai siswa?{" "}
                <Link
                  to="/masuk"
                  className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                >
                
                  Portal Siswa (NISN)
                </Link>
              </div>
              <div className="text-slate-400 text-[11px]">
                Belum memiliki akun pengajar? Hubungi Bagian Kurikulum & TU SMAIT Al-Multazam.
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
