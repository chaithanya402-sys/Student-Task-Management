import React, { useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  Edit2,
  Clock,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  LayoutList,
  Kanban,
  ArrowRight,
  Sparkles,
  Calendar,
  X,
  Download
} from "lucide-react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { TaskModal } from "../components/common/TaskModal";

export const TasksPage = () => {
  const {
    tasks,
    stats,
    currentUserId,
    toggleTaskStatus,
    updateTask,
    deleteTask,
    searchQuery,
    activeFilter
  } = useStudyDeck();

  const [viewMode, setViewMode] = useState("list"); // 'list' | 'kanban'
  const [activeTab, setActiveTab] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  // Filter tasks based on search, global filter, and local tabs
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.course.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Local tab filter
    if (activeTab === "pending" && t.status !== "pending") return false;
    if (activeTab === "in_progress" && t.status !== "in_progress") return false;
    if (activeTab === "completed" && t.status !== "completed") return false;
    if (activeTab === "overdue" && t.status !== "overdue") return false;
    if (activeTab === "assigned" && !t.isAssigned) return false;
    if (activeTab === "personal" && t.isAssigned) return false;

    // Priority filter
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

    // Global filter from modal
    if (activeFilter === "overdue" && t.status !== "overdue") return false;
    if (activeFilter === "pending" && t.status !== "pending") return false;
    if (activeFilter === "completed" && t.status !== "completed") return false;
    if (activeFilter === "assigned" && !t.isAssigned) return false;
    if (activeFilter === "personal" && t.isAssigned) return false;

    return true;
  });

  const handleEdit = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const moveTaskStatus = (task, nextStatus, e) => {
    if (e) e.stopPropagation();
    updateTask(task.id, { ...task, status: nextStatus });
  };

  // Group tasks for Kanban columns
  const kanbanColumns = [
    {
      id: "pending",
      title: "To Do",
      color: "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40",
      accent: "bg-slate-500",
      tasks: filteredTasks.filter((t) => t.status === "pending" || (!["completed", "overdue", "in_progress"].includes(t.status)))
    },
    {
      id: "in_progress",
      title: "In Progress",
      color: "border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20",
      accent: "bg-sky-500",
      tasks: filteredTasks.filter((t) => t.status === "in_progress")
    },
    {
      id: "overdue",
      title: "Overdue",
      color: "border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20",
      accent: "bg-rose-500",
      tasks: filteredTasks.filter((t) => t.status === "overdue")
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20",
      accent: "bg-emerald-500",
      tasks: filteredTasks.filter((t) => t.status === "completed")
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px] shadow-sm hover-card-lift">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Total Tasks</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalTasks}
            </span>
          </div>
          <span className="text-xs text-white/70">
            {stats.personalTasks} personal &bull; {stats.assignedTasks} coursework
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pending</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.pendingTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">Active coursework & tasks</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.completedTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400">{stats.taskCompletionRate}% completion rate</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px] hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Overdue</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {stats.overdueTasks}
            </span>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Requires priority focus</span>
        </Card>
      </div>

      {/* 2. TASK CONTROLS & TABS */}
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            {[
              { id: "all", label: `All (${tasks.length})` },
              { id: "pending", label: `To Do (${tasks.filter(t => t.status === "pending").length})` },
              { id: "in_progress", label: `In Progress (${tasks.filter(t => t.status === "in_progress").length})` },
              { id: "overdue", label: `Overdue (${tasks.filter(t => t.status === "overdue").length})` },
              { id: "completed", label: `Completed (${tasks.filter(t => t.status === "completed").length})` },
              { id: "assigned", label: "Assigned" },
              { id: "personal", label: "Personal" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action buttons & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl border border-gray-200/80 dark:border-slate-700">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
                }`}
                title="List View"
              >
                <LayoutList size={14} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-slate-900 text-[#0f1f38] dark:text-white shadow-xs"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
                }`}
                title="Kanban Board View"
              >
                <Kanban size={14} />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <a
              href={`/api/student/export/tasks?studentId=${currentUserId}`}
              download="student_tasks_report.csv"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              title="Export tasks to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </a>

            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* 3. CONTENT AREA: LIST VIEW vs KANBAN VIEW */}
        {viewMode === "list" ? (
          /* List View */
          <div className="divide-y divide-gray-100 dark:divide-slate-800/80 pt-2">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen size={36} className="mx-auto text-gray-300 dark:text-slate-600 mb-2" />
                <h4 className="text-sm font-bold text-gray-700 dark:text-slate-200">No tasks found</h4>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                  No items match your active search or filters. Click "Add Task" to create your next study milestone.
                </p>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isDone = task.status === "completed";
                const isOverdue = task.status === "overdue";

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskDetails(task)}
                    className={`py-3.5 px-2 sm:px-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors rounded-xl cursor-pointer group ${
                      isDone ? "opacity-60 bg-gray-50/40 dark:bg-slate-900/40" : ""
                    }`}
                  >
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isDone
                            ? "bg-[#0f1f38] dark:bg-blue-600 border-[#0f1f38] dark:border-blue-600 text-white"
                            : "border-gray-300 dark:border-slate-600 hover:border-[#0f1f38] dark:hover:border-blue-400 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {isDone && <Check size={13} strokeWidth={3} />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isDone ? "line-through text-gray-400 dark:text-slate-500" : "text-gray-900 dark:text-slate-100"
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.isAssigned && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                              Assigned
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Badges & Actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-block text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                        {task.course}
                      </span>

                      <Badge status={task.priority} size="sm" />

                      <span
                        className={`text-[11px] font-medium hidden md:inline-block ${
                          isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-500 dark:text-slate-400"
                        }`}
                      >
                        {task.dueDate}
                      </span>

                      <Badge status={task.status} size="sm" />

                      {/* Edit / Delete Buttons */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-2">
                        <button
                          onClick={(e) => handleEdit(task, e)}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/60 dark:hover:bg-slate-700 rounded-md transition-colors"
                          title="Edit task"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(task.id, e)}
                          className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
            {kanbanColumns.map((col) => (
              <div
                key={col.id}
                className={`rounded-2xl border ${col.color} p-3 flex flex-col min-h-[420px] transition-all`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.accent}`}></span>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
                      {col.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 shadow-2xs border border-gray-200/60 dark:border-slate-700">
                    {col.tasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[560px] pr-1">
                  {col.tasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-gray-400 dark:text-slate-500 text-xs">
                      <span>No tasks in this stage</span>
                    </div>
                  ) : (
                    col.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskDetails(task)}
                        className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-gray-200/70 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                            {task.course}
                          </span>
                          <Badge status={task.priority} size="sm" />
                        </div>

                        <h5 className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2">
                          {task.title}
                        </h5>

                        {task.description && (
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[10px] text-gray-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} /> {task.dueDate}
                          </span>

                          {/* Quick advance status buttons */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {col.id === "pending" && (
                              <button
                                onClick={(e) => moveTaskStatus(task, "in_progress", e)}
                                className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold hover:bg-sky-100 transition-colors"
                                title="Move to In Progress"
                              >
                                Start &rarr;
                              </button>
                            )}
                            {col.id === "in_progress" && (
                              <button
                                onClick={(e) => moveTaskStatus(task, "completed", e)}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition-colors"
                                title="Mark Completed"
                              >
                                Complete &check;
                              </button>
                            )}
                            {col.id === "overdue" && (
                              <button
                                onClick={(e) => moveTaskStatus(task, "completed", e)}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-semibold hover:bg-slate-200 transition-colors"
                                title="Complete Overdue Task"
                              >
                                Done &check;
                              </button>
                            )}
                            {col.id === "completed" && (
                              <button
                                onClick={(e) => moveTaskStatus(task, "pending", e)}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold hover:bg-slate-200 transition-colors"
                                title="Reopen Task"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Task Modal for Create / Edit */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />

      {/* Task Detail Modal */}
      {selectedTaskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  {selectedTaskDetails.course}
                </span>
                <h3 className="text-base font-bold text-[#0f1f38] dark:text-white mt-0.5">
                  {selectedTaskDetails.title}
                </h3>
              </div>
              <Badge status={selectedTaskDetails.status} />
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/70 p-4 rounded-2xl space-y-2 text-xs text-gray-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{selectedTaskDetails.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100 capitalize">{selectedTaskDetails.priority}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  {selectedTaskDetails.isAssigned ? "Faculty Assigned Coursework" : "Personal Study Task"}
                </span>
              </div>
            </div>

            {selectedTaskDetails.description && (
              <div>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Description:</span>
                <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed bg-gray-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                  {selectedTaskDetails.description}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={(e) => {
                  handleDelete(selectedTaskDetails.id, e);
                  setSelectedTaskDetails(null);
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleTaskStatus(selectedTaskDetails.id);
                    setSelectedTaskDetails(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 cursor-pointer"
                >
                  {selectedTaskDetails.status === "completed" ? "Mark Pending" : "Mark Completed"}
                </button>
                <button
                  onClick={() => setSelectedTaskDetails(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
