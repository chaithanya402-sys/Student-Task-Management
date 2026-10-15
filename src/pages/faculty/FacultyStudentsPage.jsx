import React, { useState } from "react";
import { useStudyDeck } from "../../context/StudyDeckContext";
import { Card } from "../../components/common/Card";
import { Users, Search, MessageSquare, CheckCircle2 } from "lucide-react";

export const FacultyStudentsPage = () => {
  const { sendStudentCheckIn } = useStudyDeck();

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sentMessage, setSentMessage] = useState({});

  const studentsList = [
    { id: "user-student-alex", name: "Alex Kumar", email: "alex.kumar@college.edu", course: "CS204 Databases", year: "B.Tech Year 2", submissions: "3 submitted", status: "Active", overdue: 0 },
    { id: "user-student-priya", name: "Priya Nair", email: "priya.nair@college.edu", course: "CS204 Databases", year: "B.Tech Year 2", submissions: "4 submitted", status: "Active", overdue: 0 },
    { id: "user-student-rahul", name: "Rahul Verma", email: "rahul.verma@college.edu", course: "CS204 Databases", year: "B.Tech Year 2", submissions: "2 submitted (1 Late)", status: "Needs Review", overdue: 1 },
    { id: "user-student-sneha", name: "Sneha Reddy", email: "sneha.reddy@college.edu", course: "CS101 Data Structures", year: "B.Tech Year 2", submissions: "4 submitted", status: "Active", overdue: 0 },
    { id: "user-student-imran", name: "Imran Shaikh", email: "imran.shaikh@college.edu", course: "CS402 Machine Learning", year: "B.Tech Year 4", submissions: "3 submitted", status: "Active", overdue: 0 },
    { id: "user-student-ananya", name: "Ananya Rao", email: "ananya.rao@college.edu", course: "CS310 Web Systems", year: "B.Tech Year 3", submissions: "3 submitted", status: "Active", overdue: 0 },
    { id: "user-student-kiran", name: "Kiran Das", email: "kiran.das@college.edu", course: "CS204 Databases", year: "B.Tech Year 2", submissions: "1 submitted", status: "At Risk", overdue: 4 },
    { id: "user-student-meera", name: "Meera Joshi", email: "meera.joshi@college.edu", course: "CS101 Data Structures", year: "B.Tech Year 2", submissions: "2 submitted", status: "At Risk", overdue: 3 },
    { id: "user-student-arjun", name: "Arjun Menon", email: "arjun.menon@college.edu", course: "CS101 Data Structures", year: "B.Tech Year 2", submissions: "2 submitted", status: "At Risk", overdue: 3 }
  ];

  const filtered = studentsList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (courseFilter !== "all" && !s.course.includes(courseFilter)) return false;
    return true;
  });

  const handleMessage = async (st) => {
    await sendStudentCheckIn(st.id, `Hello ${st.name}, checking in on your recent academic work in ${st.course}. Please drop by during office hours if you have any questions.`);
    setSentMessage(prev => ({ ...prev, [st.id]: true }));
    setTimeout(() => {
      setSentMessage(prev => ({ ...prev, [st.id]: false }));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#0f1f38]">Enrolled Students</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              128 students registered in your Autumn 2026 courses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f1f38]"
              />
            </div>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              <option value="CS101">CS101 Data Structures</option>
              <option value="CS204">CS204 Databases</option>
              <option value="CS310">CS310 Web Systems</option>
              <option value="CS402">CS402 Machine Learning</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-3">Student</th>
                <th className="pb-3">Enrolled Course</th>
                <th className="pb-3">Year / Level</th>
                <th className="pb-3">Submissions</th>
                <th className="pb-3 text-center">Academic Status</th>
                <th className="pb-3 text-right">Support Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 pr-2 font-bold text-gray-900 whitespace-nowrap">
                    {s.name}
                    <span className="block text-[11px] font-normal text-gray-400">{s.email}</span>
                  </td>
                  <td className="py-3.5 pr-2 font-medium text-gray-700 whitespace-nowrap">
                    {s.course}
                  </td>
                  <td className="py-3.5 pr-2 text-gray-500 whitespace-nowrap">
                    {s.year}
                  </td>
                  <td className="py-3.5 pr-2 text-gray-600 whitespace-nowrap">
                    {s.submissions}
                  </td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        s.status === "At Risk"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : s.status === "Needs Review"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {s.status} {s.overdue > 0 && `(${s.overdue} overdue)`}
                    </span>
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleMessage(s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        sentMessage[s.id]
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "bg-[#0f1f38] text-white hover:bg-[#1a2e4f]"
                      }`}
                    >
                      {sentMessage[s.id] ? "Message Sent!" : "Send Check-in"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
