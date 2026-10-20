import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Alert, Row, Col } from "antd";
import { Info, Lock, Phone } from "lucide-react";
import type { StudentMe } from "../../../../types/Student/studentType";
import { useUpdateProfile } from "../../../../hooks/useStudent";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialData: StudentMe;
}

export default function EditProfileModal({
  open,
  onClose,
  initialData,
}: EditProfileModalProps) {
  const [form] = Form.useForm();
  const updateMutation = useUpdateProfile();

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        phoneNumber: initialData.userDetail?.phoneNumber || "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: any) => {
    const payload = {
      phoneNumber: values.phoneNumber,
      ...(values.newPassword
        ? {
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
          }
        : {}),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        form.resetFields(["newPassword", "confirmNewPassword"]);
        setErrorMsg("");
      },
      onError: (err) => {
        const msg = getErrorMessage(err);
        setErrorMsg(msg);
      },
    });
  };

  return (
    <Modal
      title={
        <div className="pb-3 border-b border-slate-100 text-sm font-bold text-slate-800">
          Perbarui Kontak & Sandi Akun
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
    >
      <div className="pt-4">
        <div className="mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
          <Info size={16} className="text-slate-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed m-0">
            Pastikan nomor telepon aktif untuk keperluan konfirmasi konseling. Data NISN, tingkat, dan kelas hanya dapat diubah melalui pihak administrasi sekolah.
          </p>
        </div>

        {errorMsg && (
          <Alert
            message="Gagal Menyimpan"
            description={errorMsg}
            type="error"
            showIcon
            className="!mb-4 !rounded-lg"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={updateMutation.isPending}
          size="middle"
        >
          <Form.Item
            label={
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nomor Telepon / WhatsApp
              </span>
            }
            name="phoneNumber"
            rules={[{ required: true, message: "Nomor telepon wajib diisi" }]}
          >
            <Input
              prefix={<Phone size={14} className="text-slate-400 mr-1.5" />}
              placeholder="Contoh: 081234567890"
              className="!rounded-lg text-xs py-2"
            />
          </Form.Item>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 mb-5">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-3">
              Ubah Kata Sandi (Opsional)
            </span>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="text-xs font-medium text-slate-600">
                      Sandi Baru
                    </span>
                  }
                  name="newPassword"
                  rules={[{ min: 8, message: "Minimal 8 karakter" }]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<Lock size={14} className="text-slate-400 mr-1" />}
                    placeholder="Minimal 8 karakter"
                    className="!rounded-lg text-xs"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="text-xs font-medium text-slate-600">
                      Ulangi Sandi
                    </span>
                  }
                  name="confirmNewPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        if (!getFieldValue("newPassword") && !value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Sandi tidak cocok!"));
                      },
                    }),
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<Lock size={14} className="text-slate-400 mr-1" />}
                    placeholder="Konfirmasi"
                    className="!rounded-lg text-xs"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="!rounded-lg text-xs"
            >
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMutation.isPending}
              className="!bg-[#70B748] hover:!bg-[#5e9e3b] !rounded-lg text-xs font-semibold !border-none"
            >
              Simpan Data
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
