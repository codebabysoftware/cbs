import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * FETCH USER
   */
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me/");
      setUser(res.data);
    } catch {
      const name = localStorage.getItem("username");
      if (name) setUser({ name });
    }
  };

  /**
   * LOGOUT
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    delete API.defaults.headers.common["Authorization"];

    navigate("/login");
  };

  /**
   * NAVIGATION ITEMS
   */
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Students", path: "/admin/students" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Content", path: "/admin/content" },
    { name: "Course Access", path: "/admin/course-access" },
    { name: "Lesson Access", path: "/admin/lesson-access" },
  ];

  return (
    <div className="flex h-screen bg-slate-100">

      {/* ================= SIDEBAR ================= */}
      {sidebarOpen && (
        <div className="w-64 bg-white border-r flex flex-col">
          
          {/* LOGO */}
          <div className="p-4 font-semibold text-blue-600 border-b cursor-pointer"
               onClick={() => navigate("/admin")}>
            Admin Panel
          </div>

          {/* NAV */}
          <div className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`p-2 rounded text-sm cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50"
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* FOOTER USER */}
          <div className="p-3 border-t flex items-center gap-2">
            
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>

            <div className="text-sm text-slate-600 flex-1">
              {user?.name || "Admin"}
            </div>

            <button
              onClick={handleLogout}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="bg-white border-b p-3 flex items-center justify-between">
          
          {/* LEFT */}
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu />
          </button>

          <h1 className="font-semibold text-slate-700">
            Admin Dashboard
          </h1>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            
            <span className="text-sm text-slate-600">
              {user?.name || "Admin"}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;