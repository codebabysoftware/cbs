import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Lock,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const nav = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/courses", label: "Courses", icon: BookOpen },
    { path: "/admin/content", label: "Content", icon: Layers },
    { path: "/admin/course-access", label: "Course Access", icon: Lock },
    { path: "/admin/lesson-access", label: "Lesson Access", icon: Lock },
  ];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 bg-white p-2 rounded shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-40 h-full bg-white border-r w-64 p-4 transition-transform
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-xl font-bold text-blue-600 mb-6">
          LMS Admin
        </h1>

        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-blue-50"
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;