import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white border-b px-4 md:px-6 py-3 flex justify-between items-center">
      
      <h2 className="font-semibold text-lg text-slate-800">
        Admin Panel
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 hidden sm:block">
          {user?.username}
        </span>

        <button
          onClick={logout}
          className="btn-secondary text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;