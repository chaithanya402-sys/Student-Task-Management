import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { StudyDeckLogo } from "../components/common/StudyDeckLogo";
import { useStudyDeck } from "../context/StudyDeckContext";

export const RegisterPage = () => {
  const { registerUser } = useStudyDeck();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [programme, setProgramme] = useState("B.Tech");
  const [year, setYear] = useState("1");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please provide your full name");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid institution email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const res = await registerUser({
        name: fullName,
        email,
        password,
        role,
        department: role === "faculty" ? department : "Computer Science & Engineering",
        programme: role === "faculty" ? "Faculty" : programme,
        year: role === "faculty" ? "Staff" : year,
        invite_code: inviteCode
      });

      if (res.pendingApproval) {
        setSuccessMessage("Faculty registration received! Your account is pending administrator approval before login.");
      } else {
        if (role === "faculty") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8795a7] dark:bg-[#070b12] py-8 px-3 sm:px-6 flex items-center justify-center transition-colors">
      <div className="w-full max-w-[650px] bg-white dark:bg-[#0e1626] text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl p-6 sm:p-9 border border-white/60 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
          <StudyDeckLogo />
          <Link to="/login" className="text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white">
            Already have an account? Sign In
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Join the StudyDeck academic workload management platform.
          </p>

          {successMessage && (
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Registration Successful</p>
                <p className="mt-0.5">{successMessage}</p>
                <Link to="/login" className="inline-block mt-2 font-bold underline text-emerald-700 dark:text-emerald-300">
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-800">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleRegister} className="mt-5 space-y-4">
              {/* Role picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("student");
                      setError("");
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      role === "student"
                        ? "bg-[#0f1f38] text-white border-[#0f1f38] dark:bg-blue-600 dark:border-blue-600"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    Student Self-Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("faculty");
                      setError("");
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      role === "faculty"
                        ? "bg-[#0f1f38] text-white border-[#0f1f38] dark:bg-blue-600 dark:border-blue-600"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    Faculty Onboarding
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError("");
                  }}
                  placeholder={role === "faculty" ? "e.g. Dr. Priya Sharma" : "e.g. Alex Kumar"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500"
                />
              </div>

              {role === "student" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                      Programme / Degree
                    </label>
                    <select
                      value={programme}
                      onChange={(e) => setProgramme(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500 cursor-pointer"
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="B.A.">B.A.</option>
                      <option value="B.Com">B.Com</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500 cursor-pointer"
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                        Faculty Invitation Code
                      </label>
                      <span className="text-[10px] text-gray-400">Default: FACULTY2026</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="Enter code (or leave blank for admin review)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500"
                      />
                      <ShieldCheck size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Note: Faculty registration requires an invite code or pending administrator approval.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
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
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#0f1f38] dark:focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#0f1f38] dark:bg-blue-600 text-white text-xs font-bold hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-sm transition-all cursor-pointer mt-2 disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Complete Registration & Enter"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
