import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import API from "../api/api";

const StudentLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /**
   * FETCH USER (OPTIONAL API)
   */
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me/"); // adjust if needed
      setUser(res.data);
    } catch {
      // fallback → token decode (optional)
      const name = localStorage.getItem("username");
      if (name) {
        setUser({ name });
      }
    }
  };

  /**
   * LOGOUT
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // clear axios header (important)
    delete API.defaults.headers.common["Authorization"];

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ================= TOPBAR ================= */}
      <div className="bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
        
        {/* LEFT */}
        <h1
          className="text-lg font-semibold text-blue-600 cursor-pointer"
          onClick={() => navigate("/student")}
        >
          LMS
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          
          {/* USER */}
          <div className="text-sm text-slate-600 hidden sm:block">
            {user?.name || "Student"}
          </div>

          {/* AVATAR */}
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
            {user?.name ? user.name[0].toUpperCase() : "S"}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </div>

    </div>
  );
};

export default StudentLayout;