import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, FileText, BarChart2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { StudyDeckLogo } from "../components/common/StudyDeckLogo";
import { useStudyDeck } from "../context/StudyDeckContext";

export const LoginPage = () => {
  const { login } = useStudyDeck();
  const navigate = useNavigate();

  const [email, setEmail] = useState("you@college.edu");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("Student");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid institution email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    login(selectedRole.toLowerCase(), email);
    navigate("/dashboard");
  };

  const handleShortcutLogin = (role) => {
    setSelectedRole(role);
    if (role === "Student") {
      setEmail("alex.kumar@college.edu");
      setPassword("studydeck2026");
      login("student", "alex.kumar@college.edu");
    } else if (role === "Faculty") {
      setEmail("eleanor.vance@college.edu");
      setPassword("faculty2026");
      login("faculty", "eleanor.vance@college.edu");
    } else {
      setEmail("admin.chancellor@college.edu");
      setPassword("chairman2026");
      login("chairman", "admin.chancellor@college.edu");
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#8795a7] py-6 px-3 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl sm:rounded-[32px] shadow-2xl p-4 sm:p-6 md:p-8 border border-white/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Card (Dark Navy) matching Image 2 */}
          <div className="lg:col-span-7 bg-[#0f1f38] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-9 flex flex-col justify-between space-y-8">
            {/* Top Logo */}
            <div>
              <StudyDeckLogo light />
            </div>

            {/* Headline and subtitle */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Every assignment and deadline in one place.
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-lg">
                One system for students, faculty and the institution, built on the same records so everyone sees the same picture.
              </p>
            </div>

            {/* 3 Role Highlight Cards matching Image 2 */}
            <div className="space-y-3">
              {/* Student Role */}
              <div
                onClick={() => setSelectedRole("Student")}
                className={`p-3.5 rounded-2xl flex items-start gap-3.5 border transition-all cursor-pointer ${
                  selectedRole === "Student"
                    ? "bg-white/15 border-white/40 shadow-xs"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Student</h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Track tasks, submit assignments and see published marks.
                  </p>
                </div>
              </div>

              {/* Faculty Role */}
              <div
                onClick={() => setSelectedRole("Faculty")}
                className={`p-3.5 rounded-2xl flex items-start gap-3.5 border transition-all cursor-pointer ${
                  selectedRole === "Faculty"
                    ? "bg-white/15 border-white/40 shadow-xs"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Faculty</h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Publish assignments, review submissions and grade with feedback.
                  </p>
                </div>
              </div>

              {/* Chairman Role */}
              <div
                onClick={() => setSelectedRole("Chairman")}
                className={`p-3.5 rounded-2xl flex items-start gap-3.5 border transition-all cursor-pointer ${
                  selectedRole === "Chairman"
                    ? "bg-white/15 border-white/40 shadow-xs"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <BarChart2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Chairman</h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Monitor departments and academic activity across the institution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sign In Form Card matching Image 2 */}
          <div className="lg:col-span-5 flex flex-col justify-center px-2 sm:px-6 py-4">
            <div className="max-w-md w-full mx-auto space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0f1f38] tracking-tight">
                  Sign in
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Use your institution account to continue.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38] text-gray-900 transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#0f1f38] text-gray-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Keep me signed in & Forgot password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-gray-600 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="rounded border-gray-300 text-[#0f1f38] focus:ring-0 cursor-pointer"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset link has been dispatched to your institution email.");
                    }}
                    className="font-semibold text-gray-700 hover:text-[#0f1f38] underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0f1f38] text-white text-xs font-bold hover:bg-[#1a2e4f] shadow-sm transition-all cursor-pointer"
                >
                  Sign in
                </button>
              </form>

              {/* Prototype Shortcuts matching Image 2 */}
              <div className="pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase absolute">
                    Prototype Shortcuts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <button
                    type="button"
                    onClick={() => handleShortcutLogin("Student")}
                    className="py-2 px-3 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:border-[#0f1f38] hover:bg-gray-50 transition-colors cursor-pointer text-center"
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShortcutLogin("Faculty")}
                    className="py-2 px-3 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:border-[#0f1f38] hover:bg-gray-50 transition-colors cursor-pointer text-center"
                  >
                    Faculty
                  </button>
                </div>
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => handleShortcutLogin("Chairman")}
                    className="w-full py-2 px-3 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:border-[#0f1f38] hover:bg-gray-50 transition-colors cursor-pointer text-center"
                  >
                    Chairman
                  </button>
                </div>
              </div>

              {/* Footer text */}
              <p className="text-[11px] text-gray-500 leading-relaxed text-center pt-2">
                New here?{" "}
                <Link to="/register" className="font-semibold text-gray-900 underline">
                  Create a student or faculty account
                </Link>
                . Chairman accounts are set up by an administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
