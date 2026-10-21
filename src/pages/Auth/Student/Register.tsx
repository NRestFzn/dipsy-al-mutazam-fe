import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker,
  Radio,
  Alert,
  Spin,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import { useMasterData } from '../../../hooks/useMasterData';
import { useNavigate, Link } from 'react-router';
import type { RegisterPayload } from '../../../types/AuthTypes/authTypes';
import { useInfiniteSelectOptions } from '../../../hooks/Common/useInfiniteSelectOptions';

export default function Register() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedRW, setSelectedRW] = useState<string | null>(null);

  const [accountForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const { register, isLoading, error } = useAuth();
  const {
    educations,
    marriageStatuses,
    salaryRanges,
    infiniteRukunWarga,
    infiniteRukunTetangga
  } = useMasterData();

  const rwQuery = infiniteRukunWarga(20);
  const {
    options: rwOptions,
    onPopupScroll: onRWScroll,
    isLoading: loadingRW,
    isFetchingNextPage: fetchingNextRW
  } = useInfiniteSelectOptions({
    queryResult: rwQuery,
    labelKey: (item: any) => `Tingkat ${item.name}`,
    valueKey: 'id'
  });

  const rtQuery = infiniteRukunTetangga(20, selectedRW);
  const {
    options: rtOptions,
    onPopupScroll: onRTScroll,
    isLoading: loadingRT,
    isFetchingNextPage: fetchingNextRT
  } = useInfiniteSelectOptions({
    queryResult: rtQuery,
    labelKey: (item: any) => `Kelas ${item.name}`,
    valueKey: 'id'
  });

  const { data: educationList, isLoading: loadEdu } = educations;
  const { data: marriageList, isLoading: loadMarriage } = marriageStatuses;
  const { data: salaryList, isLoading: loadSalary } = salaryRanges;

  const isMasterDataLoading = loadEdu || loadMarriage || loadSalary;

  const handleRWChange = (val: string) => {
    setSelectedRW(val);
    accountForm.setFieldValue('rt', undefined);
  };

  const onAccountFinish = () => {
    setShowModal(true);
  };

  const onProfileFinish = async (profileValues: any) => {
    try {
      const accountValues = accountForm.getFieldsValue();
      const payload: RegisterPayload = {
        fullname: profileValues.namaLengkap,
        email: accountValues.email || null,
        password: accountValues.password,
        confirmPassword: accountValues.confirmPassword,
        gender: profileValues.gender,
        profession: profileValues.pekerjaan || "Siswa",
        birthDate: profileValues.tanggalLahir.format('YYYY-MM-DD'),
        MarriageStatusId: profileValues.statusPernikahan || (marriageList?.[0]?.id ?? ""),
        RukunWargaId: accountValues.rw,
        RukunTetanggaId: accountValues.rt,
        EducationId: profileValues.pendidikan || (educationList?.[0]?.id ?? ""),
        SalaryRangeId: profileValues.gaji || (salaryList?.[0]?.id ?? ""),
        nik: accountValues.nik,
        phoneNumber: profileValues.noHp || null,
      };

      await register(payload);
      setShowModal(false);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const renderErrorContent = (error: any) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      return (
        <ul className="list-disc pl-4 text-xs">
          {Object.entries(errors).map(([field, messages]: [string, any]) => (
            <li key={field}>
              <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
            </li>
          ))}
        </ul>
      );
    }
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.';
  };

  if (isMasterDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-2">
          <Spin size="default" />
          <span className="text-xs text-slate-500 font-medium">Memuat data akademik...</span>
        </div>
      </div>
    );
  }

  const filterOption = (input: string, option: any) => {
    const labelStr = String(option?.label ?? '');
    return labelStr.toLowerCase().includes(input.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-800">
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-[460px]">
          {/* Institutional Teacher Notice */}
          <div className="mb-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <InfoCircleOutlined className="text-emerald-700 text-base mt-0.5 shrink-0" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <span className="font-semibold block text-emerald-900 mb-0.5">Informasi Akses Guru & Pembimbing</span>
              Pendaftaran mandiri ini hanya untuk <strong>Siswa</strong>. Akun Guru BK & Wali Kelas telah disiapkan oleh sekolah. Silakan langsung masuk melalui{' '}
              <Link to="/masuk-admin" className="font-semibold text-emerald-800 underline hover:text-emerald-950">
                Portal Pengajar & Guru
              </Link>.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Header Brand */}
            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <img
                  src="/logo-al-multazam.png"
                  alt="Logo SMAIT Al-Multazam"
                  className="w-auto h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  SMAIT Al-Multazam
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Registrasi Akun Siswa Baru
                </p>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Pendaftaran Akun Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi identitas NISN, kata sandi, dan kelas Anda
              </p>
            </div>

            {error && (
              <Alert
                message="Gagal Mendaftar"
                description={renderErrorContent(error)}
                type="error"
                showIcon
                className="!mb-4 !rounded-lg !border-rose-200 !bg-rose-50/70 text-xs"
              />
            )}

            <Form
              form={accountForm}
              layout="vertical"
              onFinish={onAccountFinish}
              size="middle"
              autoComplete="off"
              className="space-y-3.5"
            >
              <Form.Item
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    NISN (Nomor Induk Siswa Nasional)
                  </span>
                }
                name="nik"
                rules={[
                  { required: true, message: 'NISN wajib diisi' },
                  { len: 10, message: 'NISN harus tepat 10 digit angka' },
                  { pattern: /^[0-9]+$/, message: 'NISN harus berupa angka' },
                ]}
                className="!mb-0"
              >
                <Input
                  prefix={<IdcardOutlined className="text-slate-400 mr-2 text-sm" />}
                  placeholder="Contoh: 0081234567 (10 digit)"
                  className="!rounded-lg text-sm py-2 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600"
                  maxLength={10}
                  inputMode="numeric"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email Siswa (Opsional)
                  </span>
                }
                name="email"
                rules={[{ type: 'email', message: 'Format email tidak valid' }]}
                className="!mb-0"
              >
                <Input
                  prefix={<UserOutlined className="text-slate-400 mr-2 text-sm" />}
                  placeholder="nama@siswa.almultazam.sch.id"
                  className="!rounded-lg text-sm py-2 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600"
                />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Kata Sandi
                    </span>
                  }
                  name="password"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Kata sandi wajib diisi' },
                    { min: 8, message: 'Minimal 8 karakter' },
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400 mr-2 text-sm" />}
                    placeholder="Minimal 8 karakter"
                    className="!rounded-lg text-sm py-2 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Konfirmasi Sandi
                    </span>
                  }
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Konfirmasi sandi wajib diisi' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Sandi tidak cocok!'));
                      },
                    }),
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400 mr-2 text-sm" />}
                    placeholder="Ulangi sandi"
                    className="!rounded-lg text-sm py-2 !border-slate-300 hover:!border-emerald-600 focus:!border-emerald-600"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Tingkat / Jenjang
                    </span>
                  }
                  name="rw"
                  rules={[{ required: true, message: 'Pilih tingkat' }]}
                  className="!mb-0"
                >
                  <Select
                    placeholder="Pilih Tingkat"
                    onChange={handleRWChange}
                    options={rwOptions}
                    loading={loadingRW}
                    onPopupScroll={onRWScroll}
                    notFoundContent={fetchingNextRW ? <Spin size="small" /> : null}
                    showSearch={{ filterOption }}
                    className="text-sm h-10"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Kelas
                    </span>
                  }
                  name="rt"
                  rules={[{ required: true, message: 'Pilih kelas' }]}
                  className="!mb-0"
                >
                  <Select
                    placeholder="Pilih Kelas"
                    disabled={!selectedRW}
                    options={rtOptions}
                    loading={loadingRT}
                    onPopupScroll={onRTScroll}
                    notFoundContent={fetchingNextRT ? <Spin size="small" /> : null}
                    showSearch={{ filterOption }}
                    className="text-sm h-10"
                  />
                </Form.Item>
              </div>

              <Form.Item className="!mb-0 !pt-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="!bg-[#00A651] hover:!bg-[#009245] !border-none !h-10 !rounded-lg text-sm font-semibold text-white"
                >
                  Lanjut: Lengkapi Data Diri
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Sudah memiliki akun siswa?{' '}
              <Link to="/masuk" className="text-emerald-700 font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          <div className="pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
            Lengkapi Identitas Pribadi Siswa
          </div>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={480}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onProfileFinish}
          initialValues={{ gender: 'm' }}
          size="middle"
          className="pt-4 space-y-3.5"
        >
          {error && (
            <Alert
              message="Gagal Mendaftar"
              description={renderErrorContent(error)}
              type="error"
              className="!mb-3 !rounded-lg text-xs"
            />
          )}

          <Form.Item
            label={
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nama Lengkap Siswa
              </span>
            }
            name="namaLengkap"
            rules={[{ required: true, message: 'Nama lengkap wajib diisi' }]}
            className="!mb-0"
          >
            <Input placeholder="Contoh: Muhammad Fatih" className="!rounded-lg text-sm py-2" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nomor Telepon / WhatsApp
              </span>
            }
            name="noHp"
            rules={[
              { pattern: /^[0-9]+$/, message: 'Hanya boleh berisi angka' },
              { min: 10, message: 'Minimal 10 digit' },
              { max: 15, message: 'Maksimal 15 digit' },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Contoh: 081234567890" maxLength={15} className="!rounded-lg text-sm py-2" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Tanggal Lahir
              </span>
            }
            name="tanggalLahir"
            rules={[{ required: true, message: 'Tanggal lahir wajib diisi' }]}
            className="!mb-0"
          >
            <DatePicker
              className="w-full !rounded-lg text-sm py-2"
              placeholder="Pilih tanggal lahir"
              format="DD MMMM YYYY"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Jenis Kelamin
              </span>
            }
            name="gender"
            rules={[{ required: true }]}
            className="!mb-0"
          >
            <Radio.Group className="text-sm">
              <Radio value="m">Laki-laki</Radio>
              <Radio value="f">Perempuan</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button onClick={() => setShowModal(false)} className="!rounded-lg text-xs">
              Kembali
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="!bg-[#00A651] hover:!bg-[#009245] !rounded-lg text-xs font-semibold !border-none text-white"
            >
              Simpan & Selesaikan Pendaftaran
            </Button>
          </div>
        </Form>
      </Modal>

      <footer className="text-center py-4 text-xs text-slate-400 font-normal">
        © {new Date().getFullYear()} SMAIT Al-Multazam. Sistem Informasi Konseling Siswa.
      </footer>
    </div>
  );
}
