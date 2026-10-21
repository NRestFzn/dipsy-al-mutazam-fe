import { lazy } from "react";

// Fallbacks
export const Unauthorized = lazy(
  () => import("../pages/Fallbacks/Unauthorized")
);
export const NotFound = lazy(() => import("../pages/Fallbacks/NotFound"));

// Auth
export const Login = lazy(() => import("../pages/Auth/Admin/Login"));
export const LoginStudent = lazy(() => import("../pages/Auth/Student/LoginStudent"));
export const Register = lazy(() => import("../pages/Auth/Student/Register"));

// Student
export const Home = lazy(() => import("../pages/Student/Home/Home"));
export const Profile = lazy(() => import("../pages/Student/Profile/Profile"));
export const Quiz = lazy(() => import("../pages/Student/Quiz/Quiz"));
export const Result = lazy(() => import("../pages/Student/Result/Result"));

// Wali Kelas
export const HomeWaliKelas = lazy(() => import("../pages/WaliKelas/HomeWaliKelas"));
export const ClassSummaryDashboard = lazy(() => import("../pages/WaliKelas/ClassSummaryDashboard"));
// Legacy Kader aliases
export const HomeKader = HomeWaliKelas;
export const SummaryRTDashboard = ClassSummaryDashboard;
export const SummaryRWDashboard = ClassSummaryDashboard;

// Admin Responden (Consolidated for Guru BK & Admin)
export const Responden = lazy(
  () => import("../pages/Admin/Responden/Responden")
);
export const GradeDashboard = lazy(
  () => import("../pages/Admin/Responden/GradeDashboard/GradeDashboard")
);
export const ClassDashboard = lazy(
  () => import("../pages/Admin/Responden/ClassDashboard/ClassDashboard")
);
export const StudentDashboard = lazy(
  () => import("../pages/Admin/Responden/StudentDashboard/StudentDashboard")
);
export const Submissions = lazy(
  () => import("../pages/Admin/Responden/Submissions/Submissions")
);
export const MedisResult = lazy(
  () => import("../pages/Admin/Responden/MedisResult/MedisResult")
);

// Backward Compatibility Aliases
export const AdminMedisResponden = Responden;
export const AdminDesaResponden = Responden;
export const RWDashboard = GradeDashboard;
export const RTDashboard = ClassDashboard;
export const WargaDashboard = StudentDashboard;
export const DesaRwDashboard = GradeDashboard;
export const DesaRtDashboard = ClassDashboard;
export const DesaWargaDashboard = StudentDashboard;

// Admin Wali Kelas / Akademik
export const KelolaAkademik = lazy(
  () => import("../pages/Admin/KelolaAkademik/KelolaAkademik")
);
export const PreviewStudent = lazy(
  () => import("../pages/Admin/KelolaAkademik/partials/PreviewStudent")
);
export const AdminDesaProfile = lazy(
  () => import("../pages/Admin/AdminDesa/ProfileAdmin/ProfileAdmin")
);

// Admin Medis Kuisioner & Master Data
export const KuisionerDashboard = lazy(
  () => import("../pages/Admin/AdminMedis/Kuisioner/KuisionerDashborad")
);
export const KuisionerPreview = lazy(
  () => import("../pages/Admin/AdminMedis/Kuisioner/KuisionerPreviews")
);
export const AdminMedisProfile = lazy(
  () => import("../pages/Admin/AdminMedis/ProfileAdmin/ProfileAdmin")
);
export const AdminMedisCategory = lazy(
  () => import("../pages/Admin/AdminMedis/MasterData/Category/CategoryPage")
);
