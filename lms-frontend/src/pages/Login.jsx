import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Reset error state on new attempt
    try {
      setLoading(true);
      if (!form.username || !form.password) {
        throw new Error("Please fill in both fields.");
      }
      const user = await login(form.username, form.password);

      if (user.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="flex bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl h-[600px]">
        
        {/* Left Side - Visual/Marketing */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 p-12 text-white">
          <div className="bg-white/10 p-4 rounded-full mb-8">
            <svg 
              className="w-16 h-16 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome Back</h1>
          <p className="text-lg text-blue-100 text-center font-medium">
            Unlock your potential and access a world of learning. Log in to continue your journey.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10 md:p-16">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">LMS Portal</h2>
            <p className="text-slate-600">Enter your credentials to access your dashboard</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <a href="https://forms.gle/quRpKyiuYPohBvuu8" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="mt-10 text-center text-slate-600">
            <p className="text-sm">Cant access your account? <a href="https://forms.gle/quRpKyiuYPohBvuu8" className="font-semibold text-blue-600 hover:text-blue-700">Contact your administrator</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;