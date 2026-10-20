import { Modal, Form, Input, Select, DatePicker, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAcademic } from "../../../../hooks/Admin/useAcademic";
import type { StudentAdminItem, UpdateStudentAdminPayload } from "../../../../types/Academic/academicTypes";

interface UpdateStudentModalProps {
  open: boolean;
  onCancel: () => void;
  student: StudentAdminItem | null;
}

export default function UpdateStudentModal({ open, onCancel, student }: UpdateStudentModalProps) {
  const [form] = Form.useForm();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const { useGrades, useClasses, updateStudentMutation } = useAcademic();

  const { data: gradesRes, isLoading: loadingGrades } = useGrades({ pageSize: 50 });
  const gradesList = gradesRes?.data || [];

  const { data: classesRes, isLoading: loadingClasses } = useClasses({
    gradeId: selectedGrade || undefined,
    pageSize: 50,
  });
  const classesList = classesRes?.data || [];

  useEffect(() => {
    if (student) {
      const initialGrade = student.gradeLevelId || student.RukunWargaId || null;
      setSelectedGrade(initialGrade);

      form.setFieldsValue({
        fullname: student.fullname,
        nisn: student.nisn || student.nik,
        email: student.email,
        phoneNumber: student.phoneNumber,
        gender: student.gender,
        birthDate: student.birthDate ? dayjs(student.birthDate) : undefined,
        gradeLevelId: initialGrade,
        classroomId: student.classroomId || student.RukunTetanggaId,
      });
    }
  }, [student, form]);

  const handleGradeChange = (val: string) => {
    setSelectedGrade(val);
    form.setFieldValue("classroomId", undefined);
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedGrade(null);
    onCancel();
  };

  const handleFinish = async (values: any) => {
    if (!student) return;
    try {
      const payload: UpdateStudentAdminPayload = {
        fullname: values.fullname,
        nisn: values.nisn,
        email: values.email || null,
        phoneNumber: values.phoneNumber || null,
        gender: values.gender,
        birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
        gradeLevelId: values.gradeLevelId,
        classroomId: values.classroomId,
      };

      await updateStudentMutation.mutateAsync({
        id: student.id,
        payload,
      });
      message.success(`Data siswa ${values.fullname} berhasil diperbarui!`);
      handleClose();
    } catch (err: any) {
      message.error(err?.message || "Gagal memperbarui data siswa");
    }
  };

  return (
    <Modal
      title="Ubah Data Siswa"
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      width={720}
      okText="Simpan Perubahan"
      cancelText="Batal"
      okButtonProps={{
        loading: updateStudentMutation.isPending,
        className: "!bg-[#70B748] hover:!bg-[#5e9e3b]",
      }}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-3">
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="NISN (10 Digit)"
              name="nisn"
              rules={[
                { required: true, message: "NISN wajib diisi" },
                { len: 10, message: "NISN harus tepat 10 digit" },
                { pattern: /^[0-9]+$/, message: "Hanya angka" },
              ]}
            >
              <Input placeholder="Contoh: 0081234567" maxLength={10} inputMode="numeric" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nama Lengkap Siswa"
              name="fullname"
              rules={[{ required: true, message: "Nama siswa wajib diisi" }]}
            >
              <Input placeholder="Contoh: Muhammad Fatih" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email Siswa"
              name="email"
              rules={[{ type: "email", message: "Format email tidak valid" }]}
            >
              <Input placeholder="nama@siswa.almultazam.sch.id" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Nomor Telepon / WhatsApp" name="phoneNumber">
              <Input placeholder="Contoh: 081234567890" maxLength={15} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tanggal Lahir"
              name="birthDate"
              rules={[{ required: true, message: "Pilih tanggal lahir" }]}
            >
              <DatePicker className="w-full" format="DD MMMM YYYY" placeholder="Pilih tanggal lahir" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Jenis Kelamin"
              name="gender"
              rules={[{ required: true, message: "Pilih jenis kelamin" }]}
            >
              <Select placeholder="Pilih Jenis Kelamin">
                <Select.Option value="m">Laki-laki</Select.Option>
                <Select.Option value="f">Perempuan</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tingkat / Jenjang"
              name="gradeLevelId"
              rules={[{ required: true, message: "Pilih tingkat" }]}
            >
              <Select
                placeholder="Pilih Tingkat"
                onChange={handleGradeChange}
                loading={loadingGrades}
                options={gradesList.map((g) => ({ label: g.name, value: g.id }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Kelas / Rombel"
              name="classroomId"
              rules={[{ required: true, message: "Pilih kelas" }]}
            >
              <Select
                placeholder={!selectedGrade ? "Pilih Tingkat Terlebih Dahulu" : "Pilih Kelas"}
                disabled={!selectedGrade}
                loading={loadingClasses}
                options={classesList.map((c) => ({ label: c.name, value: c.id }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

