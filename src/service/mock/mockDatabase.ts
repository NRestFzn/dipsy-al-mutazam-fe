import { ROLE_ID, MASTER_GRADES } from "../../constants";
import type {
  ClassItem,
  ClassResponse,
  CreateClassPayload,
  CreateStudentAdminPayload,
  GetClassesParams,
  GetGradesParams,
  GetStudentsAdminParams,
  GradeItem,
  GradeResponse,
  StudentAdminItem,
  StudentAdminResponse,
  UpdateClassPayload,
  UpdateStudentAdminPayload,
} from "../../types/Academic/academicTypes";
import type {
  Questionnaire,
  QuestionnaireDetail,
  Question,
  QuestionnaireHistoryResponse,
} from "../../types/Questionnaire/questionnaireTypes";

export interface AcademicHistoryItem {
  id: string;
  academicYear: string;
  gradeName: string;
  className: string;
  homeroomTeacherName?: string;
  status: "Naik Kelas" | "Tinggal Kelas" | "Lulus" | "Aktif";
  note?: string;
}

export interface StudentRecord extends StudentAdminItem {
  status: "Aktif" | "Lulus";
  entryYear?: string;
  academicYear?: string;
  academicHistory?: AcademicHistoryItem[];
  password?: string;
}

export interface QuestionnaireSubmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  gradeId: string;
  gradeName: string;
  classId: string;
  className: string;
  questionnaireId: string;
  questionnaireTitle: string;
  score: number;
  totalQuestions: number;
  status: "NORMAL" | "BORDERLINE" | "ABNORMAL";
  submittedAt: string;
  answers: Record<string, any>;
  scoringResult?: any;
}

interface MockDatabaseSchema {
  grades: GradeItem[];
  classes: ClassItem[];
  students: StudentRecord[];
  submissions: QuestionnaireSubmissionRecord[];
  questionnaires: QuestionnaireDetail[];
}

const STORAGE_KEY = "dipsy_mock_database_v3";

const INITIAL_CLASSES: ClassItem[] = [
  { id: "cls-vii-a", name: "VII-A", gradeId: "grade-vii", homeroomTeacher: "Ustadz Abdullah Al-Hafidz, S.Pd.", homeroomTeacherId: "guru-1", studentCount: 4 },
  { id: "cls-vii-b", name: "VII-B", gradeId: "grade-vii", homeroomTeacher: "Ustadzah Maryam Az-Zahra, S.Pd.", homeroomTeacherId: "guru-2", studentCount: 4 },
  { id: "cls-viii-a", name: "VIII-A", gradeId: "grade-viii", homeroomTeacher: "Ustadz Yusuf Mansyur, M.Pd.", homeroomTeacherId: "guru-3", studentCount: 4 },
  { id: "cls-viii-b", name: "VIII-B", gradeId: "grade-viii", homeroomTeacher: "Ustadzah Fatimah Azzahra, S.Ag.", homeroomTeacherId: "guru-4", studentCount: 3 },
  { id: "cls-ix-a", name: "IX-A", gradeId: "grade-ix", homeroomTeacher: "Ustadz Hamzah Al-Qudsy, S.Pd.", homeroomTeacherId: "guru-5", studentCount: 3 },
  { id: "cls-x-a", name: "X-A", gradeId: "grade-x", homeroomTeacher: "Ustadz Salman Al-Farisi, S.Pd.", homeroomTeacherId: "guru-6", studentCount: 5 },
  { id: "cls-x-b", name: "X-B", gradeId: "grade-x", homeroomTeacher: "Ustadzah Siti Aisyah, M.Pd.", homeroomTeacherId: "guru-7", studentCount: 3 },
  { id: "cls-xi-ipa", name: "XI-IPA", gradeId: "grade-xi", homeroomTeacher: "Ustadz Khalid bin Walid, S.Si.", homeroomTeacherId: "guru-8", studentCount: 4 },
  { id: "cls-xi-ips", name: "XI-IPS", gradeId: "grade-xi", homeroomTeacher: "Ustadzah Zahra Ramadhani, S.Sos.", homeroomTeacherId: "guru-9", studentCount: 3 },
  { id: "cls-xii-ipa", name: "XII-IPA", gradeId: "grade-xii", homeroomTeacher: "Ustadz Umar Al-Khattab, M.Sc.", homeroomTeacherId: "guru-10", studentCount: 3 },
  { id: "cls-xii-ips", name: "XII-IPS", gradeId: "grade-xii", homeroomTeacher: "Ustadzah Khadijah Al-Kubra, M.Pd.", homeroomTeacherId: "guru-11", studentCount: 2 },
];

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "std-001",
    nisn: "0081234567",
    fullname: "Ahmad Fauzi Rahman",
    gender: "m",
    birthDate: "2008-04-12",
    phoneNumber: "081234567801",
    email: "ahmad.fauzi@siswa.almultazam.sch.id",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-a",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-a", name: "X-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
    academicHistory: [
      {
        id: "ah-001-1",
        academicYear: "2023/2024",
        gradeName: "Kelas IX",
        className: "IX-A",
        homeroomTeacherName: "Ustadz Hamzah Al-Qudsy, S.Pd.",
        status: "Naik Kelas",
        note: "Menyelesaikan hafalan juz 30 dan aktif dalam OSIS.",
      },
      {
        id: "ah-001-2",
        academicYear: "2024/2025",
        gradeName: "Kelas X",
        className: "X-A",
        homeroomTeacherName: "Ustadz Salman Al-Farisi, S.Pd.",
        status: "Aktif",
        note: "Siswa berprestasi di bidang Matematika dan Tahfidz.",
      },
    ],
  },
  {
    id: "std-002",
    nisn: "0081234568",
    fullname: "Siti Nurhaliza Putri",
    gender: "f",
    birthDate: "2008-07-22",
    phoneNumber: "081234567802",
    email: "siti.nurhaliza@siswa.almultazam.sch.id",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-a",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-a", name: "X-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-003",
    nisn: "0081234569",
    fullname: "Muhammad Rizky Pratama",
    gender: "m",
    birthDate: "2008-01-15",
    phoneNumber: "081234567803",
    email: "m.rizky@siswa.almultazam.sch.id",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-a",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-a", name: "X-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-004",
    nisn: "0081234570",
    fullname: "Fatimah Azzahra Suherman",
    gender: "f",
    birthDate: "2008-09-08",
    phoneNumber: "081234567804",
    email: "fatimah.zahra@siswa.almultazam.sch.id",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-a",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-a", name: "X-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-005",
    nisn: "0081234571",
    fullname: "Bilal Habasyi Ash-Shidiq",
    gender: "m",
    birthDate: "2008-11-30",
    phoneNumber: "081234567805",
    email: "bilal.habasyi@siswa.almultazam.sch.id",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-a",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-a", name: "X-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-006",
    nisn: "0081234572",
    fullname: "Aisyah Nabila Syakieb",
    gender: "f",
    birthDate: "2008-03-19",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-b",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-b", name: "X-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-007",
    nisn: "0081234573",
    fullname: "Zaid bin Tsabit Firdaus",
    gender: "m",
    birthDate: "2008-06-11",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-b",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-b", name: "X-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-008",
    nisn: "0081234574",
    fullname: "Hafshah Binti Umar",
    gender: "f",
    birthDate: "2008-12-05",
    gradeLevelId: "grade-x",
    classroomId: "cls-x-b",
    gradeLevel: { id: "grade-x", name: "Kelas X" },
    classroom: { id: "cls-x-b", name: "X-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-009",
    nisn: "0112345671",
    fullname: "Muhammad Al-Fatih",
    gender: "m",
    birthDate: "2011-05-14",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-a",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-a", name: "VII-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-010",
    nisn: "0112345672",
    fullname: "Thariq bin Ziyad Al-Farabi",
    gender: "m",
    birthDate: "2011-08-09",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-a",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-a", name: "VII-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-011",
    nisn: "0112345673",
    fullname: "Salma Khalida Husna",
    gender: "f",
    birthDate: "2011-02-17",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-a",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-a", name: "VII-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-012",
    nisn: "0112345674",
    fullname: "Zulfa Safira Hanum",
    gender: "f",
    birthDate: "2011-10-25",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-a",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-a", name: "VII-A" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-013",
    nisn: "0112345675",
    fullname: "Usamah bin Zaid Pratama",
    gender: "m",
    birthDate: "2011-01-03",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-b",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-b", name: "VII-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-014",
    nisn: "0112345676",
    fullname: "Khadijah Putri Wardani",
    gender: "f",
    birthDate: "2011-06-28",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-b",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-b", name: "VII-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-015",
    nisn: "0112345677",
    fullname: "Ibrahim Hasan Basri",
    gender: "m",
    birthDate: "2011-09-14",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-b",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-b", name: "VII-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-016",
    nisn: "0112345678",
    fullname: "Ruqayyah Az-Zahra",
    gender: "f",
    birthDate: "2011-12-01",
    gradeLevelId: "grade-vii",
    classroomId: "cls-vii-b",
    gradeLevel: { id: "grade-vii", name: "Kelas VII" },
    classroom: { id: "cls-vii-b", name: "VII-B" },
    entryYear: "2024",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-017",
    nisn: "0102345671",
    fullname: "Abdullah bin Mas'ud",
    gender: "m",
    birthDate: "2010-04-18",
    gradeLevelId: "grade-viii",
    classroomId: "cls-viii-a",
    gradeLevel: { id: "grade-viii", name: "Kelas VIII" },
    classroom: { id: "cls-viii-a", name: "VIII-A" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-018",
    nisn: "0102345672",
    fullname: "Maryam Binti Imran",
    gender: "f",
    birthDate: "2010-08-30",
    gradeLevelId: "grade-viii",
    classroomId: "cls-viii-a",
    gradeLevel: { id: "grade-viii", name: "Kelas VIII" },
    classroom: { id: "cls-viii-a", name: "VIII-A" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-019",
    nisn: "0102345673",
    fullname: "Sa'ad bin Abi Waqqash",
    gender: "m",
    birthDate: "2010-11-12",
    gradeLevelId: "grade-viii",
    classroomId: "cls-viii-a",
    gradeLevel: { id: "grade-viii", name: "Kelas VIII" },
    classroom: { id: "cls-viii-a", name: "VIII-A" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-020",
    nisn: "0102345674",
    fullname: "Asma Binti Abu Bakar",
    gender: "f",
    birthDate: "2010-03-05",
    gradeLevelId: "grade-viii",
    classroomId: "cls-viii-a",
    gradeLevel: { id: "grade-viii", name: "Kelas VIII" },
    classroom: { id: "cls-viii-a", name: "VIII-A" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-021",
    nisn: "0072345671",
    fullname: "Farhan Hakim Al-Ghifari",
    gender: "m",
    birthDate: "2007-02-14",
    gradeLevelId: "grade-xi",
    classroomId: "cls-xi-ipa",
    gradeLevel: { id: "grade-xi", name: "Kelas XI" },
    classroom: { id: "cls-xi-ipa", name: "XI-IPA" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-022",
    nisn: "0072345672",
    fullname: "Nadia Nurul Fadilah",
    gender: "f",
    birthDate: "2007-09-20",
    gradeLevelId: "grade-xi",
    classroomId: "cls-xi-ipa",
    gradeLevel: { id: "grade-xi", name: "Kelas XI" },
    classroom: { id: "cls-xi-ipa", name: "XI-IPA" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-023",
    nisn: "0072345673",
    fullname: "Rayhan Firdaus Nugraha",
    gender: "m",
    birthDate: "2007-06-16",
    gradeLevelId: "grade-xi",
    classroomId: "cls-xi-ipa",
    gradeLevel: { id: "grade-xi", name: "Kelas XI" },
    classroom: { id: "cls-xi-ipa", name: "XI-IPA" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-024",
    nisn: "0072345674",
    fullname: "Syifa Rahmania Fauziah",
    gender: "f",
    birthDate: "2007-12-10",
    gradeLevelId: "grade-xi",
    classroomId: "cls-xi-ipa",
    gradeLevel: { id: "grade-xi", name: "Kelas XI" },
    classroom: { id: "cls-xi-ipa", name: "XI-IPA" },
    entryYear: "2023",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-025",
    nisn: "0062345671",
    fullname: "Dimas Aditya Pratama",
    gender: "m",
    birthDate: "2006-03-21",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ipa",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ipa", name: "XII-IPA" },
    entryYear: "2022",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-026",
    nisn: "0062345672",
    fullname: "Anisa Maulida Hasanah",
    gender: "f",
    birthDate: "2006-08-14",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ipa",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ipa", name: "XII-IPA" },
    entryYear: "2022",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-027",
    nisn: "0062345673",
    fullname: "Lukman Hakim Syarif",
    gender: "m",
    birthDate: "2006-10-09",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ipa",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ipa", name: "XII-IPA" },
    entryYear: "2022",
    academicYear: "2024/2025",
    status: "Aktif",
    password: "almultazam123",
  },
  {
    id: "std-028",
    nisn: "0052345671",
    fullname: "Ilham Ramadhan Al-Farizi (Alumni)",
    gender: "m",
    birthDate: "2005-01-11",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ipa",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ipa", name: "XII-IPA" },
    entryYear: "2021",
    academicYear: "2023/2024",
    status: "Lulus",
    password: "almultazam123",
  },
  {
    id: "std-029",
    nisn: "0052345672",
    fullname: "Naurah Jasmine Zahirah (Alumni)",
    gender: "f",
    birthDate: "2005-05-19",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ipa",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ipa", name: "XII-IPA" },
    entryYear: "2021",
    academicYear: "2023/2024",
    status: "Lulus",
    password: "almultazam123",
  },
  {
    id: "std-030",
    nisn: "0052345673",
    fullname: "Fakhri Ali Mahendra (Alumni)",
    gender: "m",
    birthDate: "2005-09-24",
    gradeLevelId: "grade-xii",
    classroomId: "cls-xii-ips",
    gradeLevel: { id: "grade-xii", name: "Kelas XII" },
    classroom: { id: "cls-xii-ips", name: "XII-IPS" },
    entryYear: "2021",
    academicYear: "2023/2024",
    status: "Lulus",
    password: "almultazam123",
  },
];

const SRQ_QUESTIONS: Question[] = [
  { id: "srq-q-1", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda sering merasa sakit kepala?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 1 },
  { id: "srq-q-2", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda tidak nafsu makan?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 2 },
  { id: "srq-q-3", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda sulit tidur nyenyak?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 3 },
  { id: "srq-q-4", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda mudah merasa takut?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 4 },
  { id: "srq-q-5", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa cemas, tegang, atau khawatir?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 5 },
  { id: "srq-q-6", QuestionnaireId: "q-srq-01", questionText: "Apakah tangan Anda sering gemetar saat menghadapi ujian/tugas?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 6 },
  { id: "srq-q-7", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda mengalami gangguan pencernaan atau sakit perut?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 7 },
  { id: "srq-q-8", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa sulit untuk berpikir jernih?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 8 },
  { id: "srq-q-9", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa tidak bahagia atau sedih belakangan ini?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 9 },
  { id: "srq-q-10", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda lebih sering menangis dari biasanya?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 10 },
  { id: "srq-q-11", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa sulit menikmati kegiatan sehari-hari di asrama/sekolah?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 11 },
  { id: "srq-q-12", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa sulit mengambil keputusan?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 12 },
  { id: "srq-q-13", QuestionnaireId: "q-srq-01", questionText: "Apakah aktivitas belajar Anda terganggu oleh perasaan tertekan?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 13 },
  { id: "srq-q-14", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa tidak mampu berperan berguna dalam kehidupan?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 14 },
  { id: "srq-q-15", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda kehilangan minat pada berbagai hal yang sebelumnya Anda sukai?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 15 },
  { id: "srq-q-16", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa tidak berharga?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 16 },
  { id: "srq-q-17", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa lelah sepanjang waktu?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 17 },
  { id: "srq-q-18", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa tidak enak di ulu hati atau dada berdebar?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 18 },
  { id: "srq-q-19", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda mudah lelah atau merasa tidak bertenaga?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 19 },
  { id: "srq-q-20", QuestionnaireId: "q-srq-01", questionText: "Apakah Anda merasa terbebani oleh rutinitas harian?", questionType: "radio", options: ["Ya", "Tidak"], status: "publish", order: 20 },
];

const SDQ_QUESTIONS: Question[] = [
  { id: "sdq-q-1", QuestionnaireId: "q-sdq-01", questionText: "Saya berusaha bersikap baik kepada orang lain. Saya peduli dengan perasaan mereka.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 1 },
  { id: "sdq-q-2", QuestionnaireId: "q-sdq-01", questionText: "Saya gelisah, saya tidak dapat diam untuk waktu lama.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 2 },
  { id: "sdq-q-3", QuestionnaireId: "q-sdq-01", questionText: "Saya sering merasa sakit kepala, sakit perut atau mual.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 3 },
  { id: "sdq-q-4", QuestionnaireId: "q-sdq-01", questionText: "Bila saya menyukai sesuatu, saya mau berbagi dengan teman-teman.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 4 },
  { id: "sdq-q-5", QuestionnaireId: "q-sdq-01", questionText: "Saya mudah marah dan sering kehilangan kendali emosi.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 5 },
  { id: "sdq-q-6", QuestionnaireId: "q-sdq-01", questionText: "Saya lebih suka menyendiri daripada bersama orang-orang sebaya saya.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 6 },
  { id: "sdq-q-7", QuestionnaireId: "q-sdq-01", questionText: "Saya biasanya melakukan apa yang diperintahkan orang tua atau guru.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 7 },
  { id: "sdq-q-8", QuestionnaireId: "q-sdq-01", questionText: "Saya banyak merasa cemas atau khawatir terhadap banyak hal.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 8 },
  { id: "sdq-q-9", QuestionnaireId: "q-sdq-01", questionText: "Saya suka menolong jika seseorang terluka, kecewa atau merasa sakit.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 9 },
  { id: "sdq-q-10", QuestionnaireId: "q-sdq-01", questionText: "Saya selalu bergerak atau tidak bisa duduk tenang.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 10 },
  { id: "sdq-q-11", QuestionnaireId: "q-sdq-01", questionText: "Saya mempunyai satu orang teman baik atau lebih di sekolah/asrama.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 11 },
  { id: "sdq-q-12", QuestionnaireId: "q-sdq-01", questionText: "Saya sering bertengkar dengan orang lain. Saya dapat memaksa orang lain melakukan apa yang saya inginkan.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 12 },
  { id: "sdq-q-13", QuestionnaireId: "q-sdq-01", questionText: "Saya sering merasa tidak bahagia, sedih, atau menangis.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 13 },
  { id: "sdq-q-14", QuestionnaireId: "q-sdq-01", questionText: "Orang lain pada umumnya menyukai saya.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 14 },
  { id: "sdq-q-15", QuestionnaireId: "q-sdq-01", questionText: "Perhatian saya mudah teralihkan, saya merasa sulit untuk berkonsentrasi.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 15 },
  { id: "sdq-q-16", QuestionnaireId: "q-sdq-01", questionText: "Saya merasa gugup dalam situasi baru. Saya mudah kehilangan rasa percaya diri.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 16 },
  { id: "sdq-q-17", QuestionnaireId: "q-sdq-01", questionText: "Saya bersikap ramah terhadap anak-anak yang lebih muda dari saya.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 17 },
  { id: "sdq-q-18", QuestionnaireId: "q-sdq-01", questionText: "Saya sering dituduh berbohong atau berbuat curang.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 18 },
  { id: "sdq-q-19", QuestionnaireId: "q-sdq-01", questionText: "Saya sering diganggu atau dipermainkan oleh teman-teman sebaya.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 19 },
  { id: "sdq-q-20", QuestionnaireId: "q-sdq-01", questionText: "Saya sering menawarkan diri untuk membantu orang lain (orang tua, guru, teman).", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 20 },
  { id: "sdq-q-21", QuestionnaireId: "q-sdq-01", questionText: "Saya berpikir matang-matang sebelum melakukan sesuatu.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 21 },
  { id: "sdq-q-22", QuestionnaireId: "q-sdq-01", questionText: "Saya mengambil barang yang bukan milik saya dari rumah, sekolah, atau tempat lain.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 22 },
  { id: "sdq-q-23", QuestionnaireId: "q-sdq-01", questionText: "Saya lebih mudah bergaul dengan orang dewasa daripada dengan orang sebaya.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 23 },
  { id: "sdq-q-24", QuestionnaireId: "q-sdq-01", questionText: "Banyak yang saya takuti, saya mudah menjadi takut.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 24 },
  { id: "sdq-q-25", QuestionnaireId: "q-sdq-01", questionText: "Saya menyelesaikan tugas sampai selesai. Perhatian saya dapat bertahan baik.", questionType: "radio", options: ["Tidak Benar", "Agak Benar", "Selalu Benar"], status: "publish", order: 25 },
];

const INITIAL_QUESTIONNAIRES: QuestionnaireDetail[] = [
  {
    id: "q-srq-01",
    title: "Self-Reporting Questionnaire (SRQ-20)",
    description: "Kuesioner skrining awal untuk mendeteksi indikasi stres psikologis, gejala kecemasan, dan kelelahan mental pada siswa SMAIT Al-Multazam.",
    status: "publish",
    scoringType: "binary_threshold",
    scoringConfig: null,
    questions: SRQ_QUESTIONS,
  },
  {
    id: "q-sdq-01",
    title: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    description: "Instrumen evaluasi perilaku, emosi, relasi sosial sebaya, dan kemampuan prososial siswa dalam lingkungan asrama dan sekolah.",
    status: "publish",
    scoringType: "binary_threshold",
    scoringConfig: null,
    questions: SDQ_QUESTIONS,
  },
];

const INITIAL_SUBMISSIONS: QuestionnaireSubmissionRecord[] = [
  {
    id: "sub-001",
    studentId: "std-001",
    studentName: "Ahmad Fauzi Rahman",
    nisn: "0081234567",
    gradeId: "grade-x",
    gradeName: "Kelas X",
    classId: "cls-x-a",
    className: "X-A",
    questionnaireId: "q-sdq-01",
    questionnaireTitle: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    score: 8,
    totalQuestions: 25,
    status: "NORMAL",
    submittedAt: "2026-10-20T08:30:00Z",
    answers: {
      "sdq-q-1": "Selalu Benar",
      "sdq-q-2": "Tidak Benar",
      "sdq-q-3": "Tidak Benar",
      "sdq-q-4": "Selalu Benar",
      "sdq-q-5": "Tidak Benar",
      "sdq-q-6": "Tidak Benar",
      "sdq-q-7": "Selalu Benar",
      "sdq-q-8": "Tidak Benar",
      "sdq-q-9": "Selalu Benar",
      "sdq-q-10": "Tidak Benar",
    },
    scoringResult: {
      totalScore: 8,
      status: "NORMAL",
      label: "Kondisi Mental Stabil (Normal)",
      recommendation: "Pertahankan pola belajar, ibadah, dan interaksi positif Anda bersama teman sebaya.",
    },
  },
  {
    id: "sub-002",
    studentId: "std-002",
    studentName: "Siti Nurhaliza Putri",
    nisn: "0081234568",
    gradeId: "grade-x",
    gradeName: "Kelas X",
    classId: "cls-x-a",
    className: "X-A",
    questionnaireId: "q-sdq-01",
    questionnaireTitle: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    score: 15,
    totalQuestions: 25,
    status: "BORDERLINE",
    submittedAt: "2026-10-20T09:15:00Z",
    answers: {},
    scoringResult: {
      totalScore: 15,
      status: "BORDERLINE",
      label: "Dalam Pemantauan (Borderline)",
      recommendation: "Perhatikan tingkat stres harian dan diskusikan kesulitan dengan wali kelas.",
    },
  },
  {
    id: "sub-003",
    studentId: "std-003",
    studentName: "Muhammad Rizky Pratama",
    nisn: "0081234569",
    gradeId: "grade-x",
    gradeName: "Kelas X",
    classId: "cls-x-a",
    className: "X-A",
    questionnaireId: "q-sdq-01",
    questionnaireTitle: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    score: 19,
    totalQuestions: 25,
    status: "ABNORMAL",
    submittedAt: "2026-10-21T10:00:00Z",
    answers: {},
    scoringResult: {
      totalScore: 19,
      status: "ABNORMAL",
      label: "Indikasi Butuh Perhatian (Abnormal)",
      recommendation: "Sangat disarankan melakukan sesi konseling bersama Guru BK SMAIT Al-Multazam.",
    },
  },
  {
    id: "sub-004",
    studentId: "std-004",
    studentName: "Fatimah Azzahra Suherman",
    nisn: "0081234570",
    gradeId: "grade-x",
    gradeName: "Kelas X",
    classId: "cls-x-a",
    className: "X-A",
    questionnaireId: "q-srq-01",
    questionnaireTitle: "Self-Reporting Questionnaire (SRQ-20)",
    score: 4,
    totalQuestions: 20,
    status: "NORMAL",
    submittedAt: "2026-10-21T11:20:00Z",
    answers: {},
  },
  {
    id: "sub-005",
    studentId: "std-005",
    studentName: "Bilal Habasyi Ash-Shidiq",
    nisn: "0081234571",
    gradeId: "grade-x",
    gradeName: "Kelas X",
    classId: "cls-x-a",
    className: "X-A",
    questionnaireId: "q-srq-01",
    questionnaireTitle: "Self-Reporting Questionnaire (SRQ-20)",
    score: 5,
    totalQuestions: 20,
    status: "NORMAL",
    submittedAt: "2026-10-22T08:45:00Z",
    answers: {},
  },
  {
    id: "sub-006",
    studentId: "std-009",
    studentName: "Muhammad Al-Fatih",
    nisn: "0112345671",
    gradeId: "grade-vii",
    gradeName: "Kelas VII",
    classId: "cls-vii-a",
    className: "VII-A",
    questionnaireId: "q-sdq-01",
    questionnaireTitle: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    score: 7,
    totalQuestions: 25,
    status: "NORMAL",
    submittedAt: "2026-10-22T09:30:00Z",
    answers: {},
  },
  {
    id: "sub-007",
    studentId: "std-010",
    studentName: "Thariq bin Ziyad Al-Farabi",
    nisn: "0112345672",
    gradeId: "grade-vii",
    gradeName: "Kelas VII",
    classId: "cls-vii-a",
    className: "VII-A",
    questionnaireId: "q-sdq-01",
    questionnaireTitle: "Kuesioner Kekuatan dan Kesulitan (SDQ)",
    score: 16,
    totalQuestions: 25,
    status: "BORDERLINE",
    submittedAt: "2026-10-22T10:15:00Z",
    answers: {},
  },
  {
    id: "sub-008",
    studentId: "std-021",
    studentName: "Farhan Hakim Al-Ghifari",
    nisn: "0072345671",
    gradeId: "grade-xi",
    gradeName: "Kelas XI",
    classId: "cls-xi-ipa",
    className: "XI-IPA",
    questionnaireId: "q-srq-01",
    questionnaireTitle: "Self-Reporting Questionnaire (SRQ-20)",
    score: 3,
    totalQuestions: 20,
    status: "NORMAL",
    submittedAt: "2026-10-23T08:00:00Z",
    answers: {},
  },
  {
    id: "sub-009",
    studentId: "std-025",
    studentName: "Dimas Aditya Pratama",
    nisn: "0062345671",
    gradeId: "grade-xii",
    gradeName: "Kelas XII",
    classId: "cls-xii-ipa",
    className: "XII-IPA",
    questionnaireId: "q-srq-01",
    questionnaireTitle: "Self-Reporting Questionnaire (SRQ-20)",
    score: 8,
    totalQuestions: 20,
    status: "BORDERLINE",
    submittedAt: "2026-10-23T09:10:00Z",
    answers: {},
  },
];

class MockDatabaseService {
  private db: MockDatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): MockDatabaseSchema {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.questionnaires && parsed.questionnaires.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read mock db from localStorage:", e);
    }

    const defaultGrades: GradeItem[] = MASTER_GRADES.map((mg) => {
      const classCount = INITIAL_CLASSES.filter((c) => c.gradeId === mg.id).length;
      const studentCount = INITIAL_STUDENTS.filter((s) => s.gradeLevelId === mg.id).length;
      return {
        id: mg.id,
        name: mg.name,
        level: mg.unit,
        classCount,
        studentCount,
      };
    });

    const initialDb: MockDatabaseSchema = {
      grades: defaultGrades,
      classes: INITIAL_CLASSES,
      students: INITIAL_STUDENTS,
      submissions: INITIAL_SUBMISSIONS,
      questionnaires: INITIAL_QUESTIONNAIRES,
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(data: MockDatabaseSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.db = data;
    } catch (e) {
      console.error("Failed to save mock db to localStorage:", e);
    }
  }

  public recalculateCounts(): void {
    const grades = this.db.grades.map((grade) => {
      const classCount = this.db.classes.filter((c) => c.gradeId === grade.id).length;
      const studentCount = this.db.students.filter(
        (s) => s.gradeLevelId === grade.id && s.status === "Aktif"
      ).length;
      return { ...grade, classCount, studentCount };
    });

    const classes = this.db.classes.map((cls) => {
      const studentCount = this.db.students.filter(
        (s) => s.classroomId === cls.id && s.status === "Aktif"
      ).length;
      return { ...cls, studentCount };
    });

    this.saveDatabase({ ...this.db, grades, classes });
  }

  // ====================== AUTH ======================
  public loginStudent(nisn: string, pass: string): any {
    const student = this.db.students.find(
      (s) => s.nisn === nisn && (s.password === pass || pass === "almultazam123")
    );

    if (!student) {
      throw new Error("NISN atau kata sandi tidak valid");
    }

    const token = `mock-token-student-${student.id}`;
    const userData = {
      id: student.id,
      nisn: student.nisn,
      fullname: student.fullname,
      email: student.email,
      roles: [{ id: ROLE_ID.SISWA, name: "Siswa" }],
      userDetail: {
        id: student.id,
        fullname: student.fullname,
        nisn: student.nisn,
        gender: student.gender,
        birthDate: student.birthDate,
        phoneNumber: student.phoneNumber,
        gradeLevelId: student.gradeLevelId,
        classroomId: student.classroomId,
        grade: student.gradeLevel,
        class: student.classroom,
        status: student.status,
      },
    };

    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    return {
      statusCode: 200,
      message: "Login berhasil",
      data: userData,
      token,
    };
  }

  public loginAdmin(email: string, pass: string): any {
    if (email === "guru.bk@almultazam.sch.id" && (pass === "guru123" || pass === "almultazam123")) {
      const token = "mock-token-guru-bk-001";
      const userData = {
        id: "usr-guru-bk",
        fullname: "Ustadzah Nurul Hidayah, S.Pd.",
        email: "guru.bk@almultazam.sch.id",
        roles: [{ id: ROLE_ID.GURU_BK, name: "Guru BK" }],
        userDetail: {
          id: "dtl-guru-bk",
          fullname: "Ustadzah Nurul Hidayah, S.Pd.",
          gender: "f",
          roleAkses: "Guru Bimbingan & Konseling",
        },
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      return { statusCode: 200, message: "Login berhasil", data: userData, token };
    }

    if (email === "wali.kelas@almultazam.sch.id" && (pass === "walikelas123" || pass === "almultazam123")) {
      const token = "mock-token-wali-kelas-001";
      const userData = {
        id: "usr-wali-kelas",
        fullname: "Ustadz Salman Al-Farisi, S.Pd.",
        email: "wali.kelas@almultazam.sch.id",
        roles: [{ id: ROLE_ID.WALI_KELAS, name: "Wali Kelas" }],
        userDetail: {
          id: "dtl-wali-kelas",
          fullname: "Ustadz Salman Al-Farisi, S.Pd.",
          gender: "m",
          classroomId: "cls-x-a",
          classroom: { id: "cls-x-a", name: "X-A" },
          gradeLevelId: "grade-x",
          gradeLevel: { id: "grade-x", name: "Kelas X" },
          roleAkses: "Wali Kelas X-A",
        },
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      return { statusCode: 200, message: "Login berhasil", data: userData, token };
    }

    throw new Error("Email atau kata sandi tidak sesuai. Periksa kredensial Anda.");
  }

  // ====================== GRADES (MASTER DATA) ======================
  public getGrades(params?: GetGradesParams): GradeResponse {
    let result = [...this.db.grades];
    if (params?.name) {
      result = result.filter((g) => g.name.toLowerCase().includes(params.name!.toLowerCase()));
    }
    return {
      statusCode: 200,
      message: "Sukses mendapatkan data tingkat",
      data: result,
      meta: {
        pagination: {
          page: 1,
          pageSize: result.length,
          total: result.length,
          pageCount: 1,
        },
      },
    };
  }

  // ====================== CLASSES ======================
  public getClasses(params?: GetClassesParams): ClassResponse {
    const page = Number(params?.page) || 1;
    const pageSize = Number(params?.pageSize) || 10;
    const gradeId = params?.gradeId || params?.GradeId;
    const search = params?.name?.toLowerCase();

    let filtered = [...this.db.classes];
    if (gradeId) {
      filtered = filtered.filter((c) => c.gradeId === gradeId);
    }
    if (search) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      statusCode: 200,
      message: "Sukses mengambil data kelas",
      data: paginated,
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          pageCount: Math.ceil(total / pageSize) || 1,
        },
      },
    };
  }

  public createClass(payload: CreateClassPayload): ClassItem {
    const grade = this.db.grades.find((g) => g.id === payload.gradeId);
    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: payload.name.startsWith("Kelas") || payload.name.includes("-") ? payload.name : `Kelas ${payload.name}`,
      gradeId: payload.gradeId,
      grade,
      homeroomTeacher: payload.homeroomTeacher || "Belum ditentukan",
      homeroomTeacherId: payload.homeroomTeacherId,
      studentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const classes = [newClass, ...this.db.classes];
    this.saveDatabase({ ...this.db, classes });
    this.recalculateCounts();
    return newClass;
  }

  public updateClass(id: string, payload: UpdateClassPayload): ClassItem {
    const index = this.db.classes.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Kelas tidak ditemukan");

    const current = this.db.classes[index];
    const updated: ClassItem = {
      ...current,
      name: payload.name ?? current.name,
      gradeId: payload.gradeId ?? current.gradeId,
      homeroomTeacher: payload.homeroomTeacher ?? current.homeroomTeacher,
      updatedAt: new Date().toISOString(),
    };

    const classes = [...this.db.classes];
    classes[index] = updated;
    this.saveDatabase({ ...this.db, classes });
    this.recalculateCounts();
    return updated;
  }

  public deleteClass(id: string): void {
    const classes = this.db.classes.filter((c) => c.id !== id);
    this.saveDatabase({ ...this.db, classes });
    this.recalculateCounts();
  }

  // ====================== STUDENTS ======================
  public getStudents(params?: GetStudentsAdminParams & { status?: string }): StudentAdminResponse {
    const page = Number(params?.page) || 1;
    const pageSize = Number(params?.pageSize) || 10;
    const search = (params?.search || params?.fullname || params?.nisn)?.toLowerCase();
    const gradeId = params?.gradeLevelId || params?.GradeId;
    const classId = params?.classroomId || params?.ClassId;
    const status = params?.status;

    let filtered = [...this.db.students];

    if (gradeId) {
      filtered = filtered.filter((s) => s.gradeLevelId === gradeId);
    }
    if (classId) {
      filtered = filtered.filter((s) => s.classroomId === classId);
    }
    if (status && status !== "Semua") {
      filtered = filtered.filter((s) => s.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.fullname.toLowerCase().includes(search) ||
          s.nisn.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      statusCode: 200,
      message: "Sukses mengambil data siswa",
      data: paginated,
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          pageCount: Math.ceil(total / pageSize) || 1,
        },
      },
    };
  }

  public getStudentById(id: string): StudentRecord {
    const student = this.db.students.find((s) => s.id === id);
    if (!student) throw new Error("Data siswa tidak ditemukan");
    return student;
  }

  public createStudent(payload: CreateStudentAdminPayload): StudentRecord {
    const grade = this.db.grades.find((g) => g.id === payload.gradeLevelId);
    const cls = this.db.classes.find((c) => c.id === payload.classroomId);

    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      nisn: payload.nisn,
      fullname: payload.fullname,
      gender: payload.gender,
      birthDate: payload.birthDate,
      email: payload.email || `${payload.nisn}@siswa.almultazam.sch.id`,
      phoneNumber: payload.phoneNumber || "081234567890",
      gradeLevelId: payload.gradeLevelId,
      classroomId: payload.classroomId,
      gradeLevel: grade ? { id: grade.id, name: grade.name } : undefined,
      classroom: cls ? { id: cls.id, name: cls.name } : undefined,
      entryYear: payload.entryYear || String(new Date().getFullYear()),
      academicYear: payload.academicYear || "2024/2025",
      status: "Aktif",
      password: payload.password || "almultazam123",
      academicHistory: [
        {
          id: `ah-${Date.now()}`,
          academicYear: payload.academicYear || "2024/2025",
          gradeName: grade?.name || "Tingkat Baru",
          className: cls?.name || "Kelas Baru",
          homeroomTeacherName: cls?.homeroomTeacher,
          status: "Aktif",
          note: "Pendaftaran siswa baru.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const students = [newStudent, ...this.db.students];
    this.saveDatabase({ ...this.db, students });
    this.recalculateCounts();
    return newStudent;
  }

  public updateStudent(id: string, payload: UpdateStudentAdminPayload): StudentRecord {
    const index = this.db.students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Siswa tidak ditemukan");

    const current = this.db.students[index];
    const grade = payload.gradeLevelId ? this.db.grades.find((g) => g.id === payload.gradeLevelId) : undefined;
    const cls = payload.classroomId ? this.db.classes.find((c) => c.id === payload.classroomId) : undefined;

    const updated: StudentRecord = {
      ...current,
      fullname: payload.fullname ?? current.fullname,
      nisn: payload.nisn ?? current.nisn,
      gender: payload.gender ?? current.gender,
      birthDate: payload.birthDate ?? current.birthDate,
      phoneNumber: payload.phoneNumber ?? current.phoneNumber,
      email: payload.email ?? current.email,
      gradeLevelId: payload.gradeLevelId ?? current.gradeLevelId,
      classroomId: payload.classroomId ?? current.classroomId,
      gradeLevel: grade ? { id: grade.id, name: grade.name } : current.gradeLevel,
      classroom: cls ? { id: cls.id, name: cls.name } : current.classroom,
      updatedAt: new Date().toISOString(),
    };

    const students = [...this.db.students];
    students[index] = updated;
    this.saveDatabase({ ...this.db, students });
    this.recalculateCounts();
    return updated;
  }

  public deleteStudent(id: string): void {
    const students = this.db.students.filter((s) => s.id !== id);
    this.saveDatabase({ ...this.db, students });
    this.recalculateCounts();
  }

  // ====================== CLASS PROMOTION (KENAIKAN KELAS) ======================
  public promoteStudents(payload: {
    sourceClassId: string;
    targetAcademicYear: string;
    promotions: Array<{
      studentId: string;
      action: "promote" | "retain" | "graduate";
      targetClassId?: string;
      targetGradeId?: string;
      note?: string;
    }>;
  }): { successCount: number } {
    const { targetAcademicYear, promotions } = payload;
    let count = 0;

    const updatedStudents = this.db.students.map((student) => {
      const promo = promotions.find((p) => p.studentId === student.id);
      if (!promo) return student;

      count++;
      const currentHistory = student.academicHistory || [];

      if (promo.action === "graduate") {
        return {
          ...student,
          status: "Lulus" as const,
          updatedAt: new Date().toISOString(),
          academicHistory: [
            ...currentHistory,
            {
              id: `ah-grad-${Date.now()}-${student.id}`,
              academicYear: targetAcademicYear,
              gradeName: student.gradeLevel?.name || "Tingkat Akhir",
              className: student.classroom?.name || "Kelas Akhir",
              homeroomTeacherName: student.classroom?.name,
              status: "Lulus" as const,
              note: promo.note || "Telah menyelesaikan pendidikan di SMAIT Al-Multazam.",
            },
          ],
        };
      }

      if (promo.action === "retain") {
        return {
          ...student,
          academicYear: targetAcademicYear,
          updatedAt: new Date().toISOString(),
          academicHistory: [
            ...currentHistory,
            {
              id: `ah-ret-${Date.now()}-${student.id}`,
              academicYear: targetAcademicYear,
              gradeName: student.gradeLevel?.name || "Tingkat Sama",
              className: student.classroom?.name || "Kelas Sama",
              status: "Tinggal Kelas" as const,
              note: promo.note || "Perlu penguatan materi pembelajaran di tingkat ini.",
            },
          ],
        };
      }

      const targetCls = this.db.classes.find((c) => c.id === promo.targetClassId);
      const targetGrd = targetCls
        ? this.db.grades.find((g) => g.id === targetCls.gradeId)
        : promo.targetGradeId
        ? this.db.grades.find((g) => g.id === promo.targetGradeId)
        : student.gradeLevel;

      return {
        ...student,
        gradeLevelId: targetGrd ? targetGrd.id : student.gradeLevelId,
        classroomId: targetCls ? targetCls.id : student.classroomId,
        gradeLevel: targetGrd ? { id: targetGrd.id, name: targetGrd.name } : student.gradeLevel,
        classroom: targetCls ? { id: targetCls.id, name: targetCls.name } : student.classroom,
        academicYear: targetAcademicYear,
        updatedAt: new Date().toISOString(),
        academicHistory: [
          ...currentHistory,
          {
            id: `ah-prom-${Date.now()}-${student.id}`,
            academicYear: targetAcademicYear,
            gradeName: targetGrd?.name || "Tingkat Baru",
            className: targetCls?.name || "Kelas Baru",
            homeroomTeacherName: targetCls?.homeroomTeacher,
            status: "Naik Kelas" as const,
            note: promo.note || "Naik kelas ke tahun ajaran baru.",
          },
        ],
      };
    });

    this.saveDatabase({ ...this.db, students: updatedStudents });
    this.recalculateCounts();
    return { successCount: count };
  }

  // ====================== QUESTIONNAIRES ======================
  public getQuestionnaires(): Questionnaire[] {
    return this.db.questionnaires.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      status: q.status,
      riskThreshold: 10,
      cooldownInMinutes: 0,
      CategoryId: "cat-skrining-01",
      scoringType: q.scoringType,
      scoringConfig: q.scoringConfig,
      category: { id: "cat-skrining-01", name: "Kesehatan Mental Remaja" },
      isAvailable: false,
      availableAt: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    }));
  }

  public getQuestionnaireById(id: string): QuestionnaireDetail {
    const found = this.db.questionnaires.find((q) => q.id === id);
    if (!found) {
      return this.db.questionnaires[0];
    }
    return found;
  }

  public submitAnswers(
    questionnaireId: string,
    answers: Record<string, string>,
    studentIdOverride?: string
  ): any {
    const rawUser = localStorage.getItem("userData");
    let currentStudent: any = null;
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        currentStudent = this.db.students.find((s) => s.id === (studentIdOverride || u.id));
      } catch (e) {
        // ignore
      }
    }
    if (!currentStudent) {
      currentStudent = this.db.students[0];
    }

    const quiz = this.getQuestionnaireById(questionnaireId);

    let score = 0;
    Object.values(answers).forEach((val) => {
      if (val === "Ya" || val === "true" || val === "Selalu Benar") {
        score += 1;
      } else if (val === "Agak Benar") {
        score += 1;
      }
    });

    const isSRQ = questionnaireId.includes("srq");
    let status: "NORMAL" | "BORDERLINE" | "ABNORMAL" = "NORMAL";
    let recommendation = "Pertahankan pola belajar, ibadah, dan relasi sosial positif Anda.";

    if (isSRQ) {
      if (score >= 8) {
        status = "ABNORMAL";
        recommendation = "Hasil skrining menunjukkan indikasi stres/tekanan mental. Disarankan berkonsultasi dengan Guru BK.";
      } else if (score >= 6) {
        status = "BORDERLINE";
        recommendation = "Kondisi emosi dalam tahap pemantauan. Luangkan waktu istirahat dan ceritakan kendala pada wali kelas.";
      }
    } else {
      if (score >= 17) {
        status = "ABNORMAL";
        recommendation = "Terdapat indikasi kesulitan penyesuaian emosi/perilaku. Konsultasikan dengan Guru BK untuk pendampingan.";
      } else if (score >= 14) {
        status = "BORDERLINE";
        recommendation = "Terdapat beberapa tantangan emosional/perilaku dalam tahap observasi pendamping asrama.";
      }
    }

    const newSub: QuestionnaireSubmissionRecord = {
      id: `sub-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullname,
      nisn: currentStudent.nisn,
      gradeId: currentStudent.gradeLevelId,
      gradeName: currentStudent.gradeLevel?.name || "Kelas X",
      classId: currentStudent.classroomId,
      className: currentStudent.classroom?.name || "X-A",
      questionnaireId: quiz.id,
      questionnaireTitle: quiz.title,
      score,
      totalQuestions: quiz.questions?.length || 20,
      status,
      submittedAt: new Date().toISOString(),
      answers,
      scoringResult: {
        totalScore: score,
        status,
        label: status === "NORMAL" ? "Normal (Stabil)" : status === "BORDERLINE" ? "Borderline (Pemantauan)" : "Indikasi Butuh Perhatian",
        recommendation,
      },
    };

    const submissions = [newSub, ...this.db.submissions];
    this.saveDatabase({ ...this.db, submissions });

    return {
      statusCode: 201,
      message: "Jawaban berhasil dikirim",
      data: newSub,
    };
  }

  public getDetailAnswer(submissionId: string): any {
    const sub = this.db.submissions.find((s) => s.id === submissionId) || this.db.submissions[0];
    const quiz = this.getQuestionnaireById(sub.questionnaireId);

    const questionnaireAnswer = (quiz.questions || []).map((q, idx) => {
      const userAns = sub.answers[q.id] || (idx % 3 === 0 ? "Ya" : "Tidak");
      return {
        answerValue: userAns,
        answerLabel: userAns,
        score: userAns === "Ya" || userAns === "true" || userAns === "Selalu Benar" ? 1 : 0,
        questionnaireQuestion: {
          questionText: q.questionText,
          questionType: q.questionType,
          order: q.order,
        },
      };
    });

    return {
      statusCode: 200,
      data: {
        id: sub.id,
        QuestionnaireId: sub.questionnaireId,
        score: sub.score,
        totalScore: sub.score,
        status: sub.status,
        submittedAt: sub.submittedAt,
        scoringResult: sub.scoringResult || {
          totalScore: sub.score,
          status: sub.status,
          label: sub.status,
          recommendation: "Pertahankan kesehatan mental dan keseimbangan aktivitas belajar Anda.",
        },
        questionnaireAnswer,
      },
    };
  }

  public getStudentHistory(studentId?: string, questionnaireId?: string): QuestionnaireHistoryResponse[] {
    let list = [...this.db.submissions];
    if (studentId) {
      list = list.filter((s) => s.studentId === studentId);
    }
    if (questionnaireId && questionnaireId !== "all") {
      list = list.filter((s) => s.questionnaireId === questionnaireId);
    }

    return list.map((s) => ({
      id: s.id,
      UserId: s.studentId,
      QuestionnaireId: s.questionnaireId,
      isAssisted: false,
      submittedBy: {
        id: s.studentId,
        fullname: s.studentName,
        email: `${s.nisn}@siswa.almultazam.sch.id`,
        profilePicture: "",
        createdAt: s.submittedAt,
        updatedAt: s.submittedAt,
      },
      user: {
        id: s.studentId,
        fullname: s.studentName,
        email: `${s.nisn}@siswa.almultazam.sch.id`,
        profilePicture: "",
      },
      questionnaire: {
        id: s.questionnaireId,
        title: s.questionnaireTitle,
      },
      createdAt: s.submittedAt,
      updatedAt: s.submittedAt,
    }));
  }

  // ====================== QUESTIONNAIRE SUBMISSIONS & MONITORING ======================
  public getSubmissions(): QuestionnaireSubmissionRecord[] {
    return this.db.submissions;
  }

  public getSummaryGrade(gradeId?: string): any {
    const list = gradeId
      ? this.db.submissions.filter((s) => s.gradeId === gradeId)
      : this.db.submissions;

    const normal = list.filter((s) => s.status === "NORMAL").length;
    const borderline = list.filter((s) => s.status === "BORDERLINE").length;
    const abnormal = list.filter((s) => s.status === "ABNORMAL").length;
    const total = list.length || 1;

    return {
      statusCode: 200,
      data: {
        totalSubmissions: list.length,
        normal,
        borderline,
        abnormal,
        percentageNormal: Math.round((normal / total) * 100),
        percentageBorderline: Math.round((borderline / total) * 100),
        percentageAbnormal: Math.round((abnormal / total) * 100),
      },
    };
  }

  public getSummaryClass(classId?: string): any {
    const list = classId
      ? this.db.submissions.filter((s) => s.classId === classId)
      : this.db.submissions;

    const normal = list.filter((s) => s.status === "NORMAL").length;
    const borderline = list.filter((s) => s.status === "BORDERLINE").length;
    const abnormal = list.filter((s) => s.status === "ABNORMAL").length;
    const total = list.length || 1;

    return {
      statusCode: 200,
      data: {
        totalSubmissions: list.length,
        normal,
        borderline,
        abnormal,
        percentageNormal: Math.round((normal / total) * 100),
        percentageBorderline: Math.round((borderline / total) * 100),
        percentageAbnormal: Math.round((abnormal / total) * 100),
      },
    };
  }

  public getSummaryStudent(classId?: string): any {
    const studentsInClass = classId
      ? this.db.students.filter((s) => s.classroomId === classId)
      : this.db.students;

    const items = studentsInClass.map((student) => {
      const submission = this.db.submissions.find((s) => s.studentId === student.id);
      return {
        id: student.id,
        fullname: student.fullname,
        nisn: student.nisn,
        gender: student.gender,
        status: submission ? submission.status : "BELUM_MENGISI",
        score: submission ? submission.score : null,
        totalQuestions: submission ? submission.totalQuestions : 25,
        lastSubmittedAt: submission ? submission.submittedAt : null,
        submissionId: submission ? submission.id : null,
      };
    });

    return {
      statusCode: 200,
      data: items,
    };
  }
}

export const mockDatabase = new MockDatabaseService();
