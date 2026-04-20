import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

/**
 * PROTECTED ROUTE
 * @param {children} ReactNode
 * @param {role} string (optional: 'admin' or 'student')
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Wait until auth loads
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;