import { Routes, Route, Navigate } from "react-router-dom";

/**
 * LAYOUTS
 */
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

/**
 * ADMIN PAGES
 */
import Dashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Courses from "../pages/admin/Courses";
import Content from "../pages/admin/CourseContentManager";
import CourseAccess from "../pages/admin/CourseAccess";
import LessonAccess from "../pages/admin/LessonAccess";

/**
 * STUDENT PAGES
 */
import StudentDashboard from "../pages/student/Dashboard";
import CoursePlayer from "../pages/student/CoursePlayer";

/**
 * AUTH
 */
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        
        {/* Default → Dashboard */}
        <Route index element={<Dashboard />} />

        <Route path="students" element={<Students />} />
        <Route path="courses" element={<Courses />} />
        <Route path="content" element={<Content />} />
        <Route path="course-access" element={<CourseAccess />} />
        <Route path="lesson-access" element={<LessonAccess />} />

      </Route>

      {/* ================= STUDENT ================= */}
      <Route path="/student" element={<StudentLayout />}>

        {/* Default → Student Dashboard */}
        <Route index element={<StudentDashboard />} />

        <Route path="course/:id" element={<CoursePlayer />} />

      </Route>

      {/* ================= DEFAULT REDIRECT ================= */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ================= 404 FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;