import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Button, Card, DatePicker, Form, Input, Radio, Select, Typography } from "antd";
import { Lock, Mail, Phone, SquareUserRound } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { academicService } from "../../../service/Admin/academicService";
import type { RegisterPayload } from "../../../types/AuthTypes/authTypes";

const { Title, Text } = Typography;

interface GradeOption {
  id: string;
  name: string;
  level?: string | null;
}

interface ClassOption {
  id: string;
  name: string;
  gradeId?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [grades, setGrades] = useState<GradeOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();

  useEffect(() => {
    academicService
      .getGrades({ pageSize: 50 })
      .then((res) => setGrades(res?.data || []))
      .catch(() => setGrades([]));
  }, []);

  useEffect(() => {
    academicService
      .getClasses({ pageSize: 100 })
      .then((res) => setClasses(res?.data || []))
      .catch(() => setClasses([]));
  }, []);

  const classOptions = classes.filter((item) => item.gradeId === selectedGrade);

  const onFinish = async (values: any) => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload: RegisterPayload = {
        fullname: values.fullname,
        nisn: values.nisn,
        email: values.email || null,
        phoneNumber: values.phoneNumber || null,
        gender: values.gender,
        birthDate: dayjs(values.birthDate).format("YYYY-MM-DD"),
        GradeId: values.GradeId,
        ClassId: values.ClassId,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      await register(payload);
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <div className="text-center mb-6">
          <img
            src="/logo-al-multazam.png"
            alt="Logo SMAIT Al-Multazam"
            className="h-16 w-auto mx-auto mb-4"
          />
          <Title level={3} className="!mb-1 !font-bold">
            Daftar Akun Siswa
          </Title>
          <Text className="text-gray-500">
            Lengkapi data berikut untuk membuat akun skrining kesehatan mental.
          </Text>
        </div>

        {errorMsg && (
          <Alert
            title="Pendaftaran Gagal"
            description={errorMsg}
            type="error"
            showIcon
            className="!mb-4"
          />
        )}

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="NISN"
            name="nisn"
            rules={[
              { required: true, message: "NISN wajib diisi" },
              { len: 10, message: "NISN harus 10 digit" },
              { pattern: /^[0-9]+$/, message: "NISN harus berupa angka" },
            ]}
          >
            <Input prefix={<SquareUserRound size={16} />} placeholder="10 digit NISN" maxLength={10} inputMode="numeric" />
          </Form.Item>

          <Form.Item
            label="Nama Lengkap"
            name="fullname"
            rules={[{ required: true, message: "Nama lengkap wajib diisi" }]}
          >
            <Input placeholder="Nama lengkap siswa" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item label="Email (opsional)" name="email" rules={[{ type: "email", message: "Format email tidak valid" }]}>
              <Input prefix={<Mail size={16} />} placeholder="nama@email.com" />
            </Form.Item>

            <Form.Item label="Nomor Telepon (opsional)" name="phoneNumber">
              <Input prefix={<Phone size={16} />} placeholder="08xxxxxxxxxx" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              label="Jenis Kelamin"
              name="gender"
              rules={[{ required: true, message: "Pilih jenis kelamin" }]}
            >
              <Radio.Group>
                <Radio value="m">Laki-laki</Radio>
                <Radio value="f">Perempuan</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Tanggal Lahir"
              name="birthDate"
              rules={[{ required: true, message: "Pilih tanggal lahir" }]}
            >
              <DatePicker className="w-full" format="DD MMMM YYYY" placeholder="Pilih tanggal lahir" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              label="Tingkat"
              name="GradeId"
              rules={[{ required: true, message: "Pilih tingkat" }]}
            >
              <Select
                placeholder="Pilih tingkat"
                onChange={(value) => {
                  setSelectedGrade(value);
                  form.setFieldValue("ClassId", undefined);
                }}
                options={grades.map((grade) => ({
                  value: grade.id,
                  label: grade.level ? `${grade.name} (${grade.level})` : grade.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Kelas"
              name="ClassId"
              rules={[{ required: true, message: "Pilih kelas" }]}
            >
              <Select
                placeholder={selectedGrade ? "Pilih kelas" : "Pilih tingkat dulu"}
                disabled={!selectedGrade}
                options={classOptions.map((item) => ({ value: item.id, label: item.name }))}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              label="Kata Sandi"
              name="password"
              rules={[{ required: true, message: "Kata sandi wajib diisi" }, { min: 8, message: "Minimal 8 karakter" }]}
            >
              <Input.Password prefix={<Lock size={16} />} placeholder="Minimal 8 karakter" />
            </Form.Item>

            <Form.Item
              label="Ulangi Kata Sandi"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Ulangi kata sandi" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject(new Error("Kata sandi tidak cocok"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<Lock size={16} />} placeholder="Ulangi kata sandi" />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            className="!h-11 !rounded-xl !font-semibold !bg-[#00A651] hover:!bg-[#009245] !border-none"
          >
            Daftar Sekarang
          </Button>
        </Form>

        <div className="text-center mt-6 text-sm">
          <Text className="text-gray-500">Sudah punya akun? </Text>
          <Link to="/masuk" className="font-semibold !text-[#00A651] hover:underline">
            Masuk di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}
