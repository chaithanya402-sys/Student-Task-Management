import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { StudyDeckLogo } from "../components/common/StudyDeckLogo";
import { useStudyDeck } from "../context/StudyDeckContext";

export const RegisterPage = () => {
  const { login, updateProfile } = useStudyDeck();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [programme, setProgramme] = useState("B.Tech");
  const [year, setYear] = useState("1");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please provide your full name");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid institution email");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    updateProfile({
      fullName,
      email,
      programme,
      year,
      role
    });

    login(role, email);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#8795a7] py-6 px-3 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-[650px] bg-white rounded-3xl shadow-2xl p-6 sm:p-9 border border-white/60">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <StudyDeckLogo />
          <Link to="/login" className="text-xs font-semibold text-gray-500 hover:text-gray-900">
            Already have an account? Sign In
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold text-[#0f1f38] tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join the StudyDeck academic workload management platform.
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-5 space-y-4">
            {/* Role picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    role === "student"
                      ? "bg-[#0f1f38] text-white border-[#0f1f38]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    role === "faculty"
                      ? "bg-[#0f1f38] text-white border-[#0f1f38]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Faculty Account
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Alex Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Institution Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Programme / Degree
                </label>
                <select
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#0f1f38] cursor-pointer"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="B.A.">B.A.</option>
                  <option value="B.Com">B.Com</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#0f1f38] cursor-pointer"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0f1f38] text-white text-xs font-bold hover:bg-[#1a2e4f] shadow-sm transition-all cursor-pointer mt-2"
            >
              Complete Registration & Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
