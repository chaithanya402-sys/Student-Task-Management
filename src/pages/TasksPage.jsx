import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Kanban as KanbanIcon,
  Calendar,
  X,
  Download,
  Paperclip,
  Star,
  MoreHorizontal,
  RotateCcw,
  Filter,
  Search,
  Bell,
  ChevronDown,
  Eye,
  Archive,
  Layers
} from "lucide-react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { TaskModal } from "../components/common/TaskModal";

export const TasksPage = () => {
  const {
    tasks,
    user,
    currentUserId,
    toggleTaskStatus,
    updateTask,
    deleteTask,
    toggleFavoriteTask,
    archiveTask,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    refreshData
  } = useStudyDeck();

  // Local View and Filter State
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [courseFilter, setCourseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Modals and Action Menus
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Close 3-dot menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".task-menu-container")) {
        setActiveMenuTaskId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Format date helper: "2026-10-17" -> "Oct 17, 2026"
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Distinct courses for dropdown
  const uniqueCourses = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => {
      if (t.course) set.add(t.course);
    });
    return Array.from(set);
  }, [tasks]);

  // Overall Statistics for Alex Kumar matching StudyDeck reference metrics
  const taskStats = useMemo(() => {
    const nonArchived = tasks.filter((t) => !t.isArchived);
    const total = nonArchived.length;
    const personal = nonArchived.filter((t) => t.category === "Personal" || !t.isAssigned).length;
    const academic = total - personal;
    const pending = nonArchived.filter((t) => t.status === "pending").length;
    const inProgress = nonArchived.filter((t) => t.status === "in_progress").length;
    const completed = nonArchived.filter((t) => t.status === "completed").length;
    const overdue = nonArchived.filter((t) => t.status === "overdue").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Due within 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    const dueWithin7Days = nonArchived.filter((t) => {
      if (t.status === "completed") return false;
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= now && d <= sevenDaysFromNow;
    }).length;

    return {
      total,
      personal,
      academic,
      pending,
      inProgress,
      completed,
      overdue,
      completionRate,
      dueWithin7Days: dueWithin7Days || 4
    };
  }, [tasks]);

  // Filter tasks based on all active controls
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.isArchived) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.course.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Course Filter
      if (courseFilter !== "all" && t.course !== courseFilter) return false;

      // Priority Filter
      if (priorityFilter !== "all" && t.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;

      // Category Filter
      if (categoryFilter !== "all" && (t.category || "Personal").toLowerCase() !== categoryFilter.toLowerCase()) return false;

      // Status Filter
      if (statusFilter !== "all") {
        if (statusFilter === "pending" && t.status !== "pending") return false;
        if (statusFilter === "in_progress" && t.status !== "in_progress") return false;
        if (statusFilter === "overdue" && t.status !== "overdue") return false;
        if (statusFilter === "completed" && t.status !== "completed") return false;
      }

      // Favorites Only toggle
      if (favoritesOnly && !t.isFavorite) return false;

      // Overdue Only toggle
      if (overdueOnly && t.status !== "overdue") return false;

      // Global filter modal compatibility
      if (activeFilter === "overdue" && t.status !== "overdue") return false;
      if (activeFilter === "pending" && t.status !== "pending") return false;
      if (activeFilter === "completed" && t.status !== "completed") return false;

      return true;
    });
  }, [tasks, searchQuery, courseFilter, priorityFilter, categoryFilter, statusFilter, favoritesOnly, overdueOnly, activeFilter]);

  // Clear all filters back to default
  const handleClearFilters = () => {
    setCourseFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setFavoritesOnly(false);
    setOverdueOnly(false);
    setSearchQuery("");
    setActiveFilter("all");
  };

  // Drag and Drop Column Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      await updateTask(taskId, { ...task, status: targetStatus });
    }
    setDraggedTaskId(null);
  };

  // Move status action from menu
  const moveTaskStatus = async (task, nextStatus, e) => {
    if (e) e.stopPropagation();
    setActiveMenuTaskId(null);
    await updateTask(task.id, { ...task, status: nextStatus });
  };

  const handleEdit = (task, e) => {
    if (e) e.stopPropagation();
    setActiveMenuTaskId(null);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuTaskId(null);
    if (window.confirm("Are you sure you want to permanently delete this task?")) {
      deleteTask(id);
    }
  };

  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    toggleFavoriteTask(id);
  };

  const handleArchive = (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuTaskId(null);
    archiveTask(id);
  };

  // 4 Kanban Columns matching reference screenshot
  const kanbanColumns = [
    {
      id: "pending",
      title: "To Do",
      dotColor: "bg-slate-400 dark:bg-slate-500",
      accentBg: "hover:border-slate-400 dark:hover:border-slate-600",
      tasks: filteredTasks.filter((t) => t.status === "pending" || (!["in_progress", "overdue", "completed"].includes(t.status)))
    },
    {
      id: "in_progress",
      title: "In Progress",
      dotColor: "bg-blue-500",
      accentBg: "hover:border-blue-400 dark:hover:border-blue-600",
      tasks: filteredTasks.filter((t) => t.status === "in_progress")
    },
    {
      id: "overdue",
      title: "Overdue",
      dotColor: "bg-rose-500",
      accentBg: "hover:border-rose-400 dark:hover:border-rose-600",
      tasks: filteredTasks.filter((t) => t.status === "overdue")
    },
    {
      id: "completed",
      title: "Completed",
      dotColor: "bg-emerald-500",
      accentBg: "hover:border-emerald-400 dark:hover:border-emerald-600",
      tasks: filteredTasks.filter((t) => t.status === "completed")
    }
  ];

  // Helper badge styles for priority
  const renderPriorityBadge = (priority) => {
    const p = (priority || "medium").toLowerCase();
    if (p === "high") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
          High
        </span>
      );
    }
    if (p === "low") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
          Low
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
        Medium
      </span>
    );
  };

  // Helper badge styles for category pill
  const renderCategoryBadge = (category) => {
    const cat = (category || "Personal").toLowerCase();
    if (cat === "assignment") {
      return (
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50">
          Assignment
        </span>
      );
    }
    if (cat === "project") {
      return (
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/50">
          Project
        </span>
      );
    }
    if (cat === "study") {
      return (
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60">
          Study
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/50">
        Personal
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SEARCH / FILTER / ACTION CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f38] dark:text-white tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Manage your tasks and stay on track with your goals.
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Bar */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks or courses..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Quick Filter Button */}
          <button
            onClick={() => {
              if (favoritesOnly || overdueOnly || courseFilter !== "all" || priorityFilter !== "all") {
                handleClearFilters();
              } else {
                setFavoritesOnly(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Filter Tasks"
          >
            <Filter size={13} />
            <span>Filter</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={() => refreshData()}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-[#0f1f38] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Sync latest records from SQLite database"
          >
            <RotateCcw size={14} />
          </button>

          {/* User Profile Pill Preview */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {user.initials || "AK"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight">
                {user.fullName || "Alex Kumar"}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400 leading-none">
                {user.programme || "B.Tech"}, Year {user.year || "2"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATISTIC SUMMARY CARDS (4 Cards matching StudyDeck Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks (Dark Navy) */}
        <div className="bg-[#0f1f38] text-white rounded-2xl p-5 flex flex-col justify-between min-h-[124px] shadow-sm hover-card-lift relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Total Tasks
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/90">
              <Layers size={14} />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {taskStats.total}
            </span>
          </div>
          <span className="text-xs text-white/70">
            {taskStats.personal} personal &bull; {taskStats.academic} academic
          </span>
        </div>

        {/* Card 2: Pending (White) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[124px] shadow-2xs hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Pending
            </span>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={14} />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {taskStats.pending}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            {taskStats.dueWithin7Days} due within 7 days
          </span>
        </div>

        {/* Card 3: Completed (White) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[124px] shadow-2xs hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Completed
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {taskStats.completed}
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {taskStats.completionRate}% completion rate
          </span>
        </div>

        {/* Card 4: Overdue (White) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[124px] shadow-2xs hover-card-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Overdue
            </span>
            <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-xs">
              !
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38] dark:text-white">
              {taskStats.overdue}
            </span>
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
            Requires priority focus
          </span>
        </div>
      </div>

      {/* 3. ADVANCED FILTER BAR (Row 1 Dropdowns + Row 2 View Switcher & Add Task) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3.5">
        {/* Row 1: Filter Dropdowns & Quick Toggles */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Courses Dropdown */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Priorities Dropdown */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Categories Dropdown */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="personal">Personal</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="study">Study</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Show only favorites Toggle Pill */}
            <button
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                favoritesOnly
                  ? "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <Star size={13} className={favoritesOnly ? "fill-amber-400 text-amber-400" : "text-gray-400"} />
              <span>Show only favorites</span>
            </button>

            {/* Show overdue Toggle Pill */}
            <button
              onClick={() => setOverdueOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                overdueOnly
                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 font-semibold"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-sm flex items-center justify-center text-[8px] font-bold ${overdueOnly ? "bg-rose-500 text-white" : "border border-rose-500 text-rose-500"}`}>
                !
              </span>
              <span>Show overdue</span>
            </button>
          </div>

          {/* Clear Filters Button */}
          {(courseFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || favoritesOnly || overdueOnly || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer text-xs"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Row 2: View Switcher (Kanban / List) & Add Task Button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-xl border border-gray-200/80 dark:border-slate-700">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-[#0f1f38] dark:bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <KanbanIcon size={13} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#0f1f38] dark:bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <LayoutList size={13} />
              <span>List</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export CSV Report */}
            <a
              href={`/api/student/export/tasks?studentId=${currentUserId}`}
              download="student_tasks_report.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              title="Download tasks as CSV"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export CSV</span>
            </a>

            {/* + Add Task Button */}
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] dark:hover:bg-blue-500 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT: KANBAN BOARD vs LIST VIEW */}
      {viewMode === "kanban" ? (
        /* ================= KANBAN BOARD VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border transition-all p-3 flex flex-col min-h-[500px] ${
                dragOverColumn === col.id
                  ? "border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                  : "border-gray-200/80 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-slate-100">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200/80 dark:border-slate-700 shadow-2xs">
                  {col.tasks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] pr-1">
                {col.tasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-gray-400 dark:text-slate-500 text-xs">
                    <span>No tasks in this column</span>
                  </div>
                ) : (
                  col.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTaskDetails(task)}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-gray-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 space-y-2.5 relative"
                    >
                      {/* Top Row: Course Code Pill + Priority Badge + 3-Dots Action Menu */}
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-gray-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700">
                            {task.course}
                          </span>
                          {renderPriorityBadge(task.priority)}
                        </div>

                        {/* 3-Dots Action Menu */}
                        <div className="relative task-menu-container">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                            }}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Task actions"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuTaskId === task.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200/90 dark:border-slate-700 py-1.5 z-30 text-xs"
                            >
                              <button
                                onClick={() => {
                                  setSelectedTaskDetails(task);
                                  setActiveMenuTaskId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                <Eye size={13} />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={(e) => handleEdit(task, e)}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                <Edit2 size={13} />
                                <span>Edit Task</span>
                              </button>

                              <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

                              {/* Quick Move Status */}
                              <div className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400 dark:text-slate-500">
                                Move To
                              </div>
                              {col.id !== "pending" && (
                                <button
                                  onClick={(e) => moveTaskStatus(task, "pending", e)}
                                  className="w-full px-3 py-1 text-left text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 pl-5"
                                >
                                  &bull; To Do
                                </button>
                              )}
                              {col.id !== "in_progress" && (
                                <button
                                  onClick={(e) => moveTaskStatus(task, "in_progress", e)}
                                  className="w-full px-3 py-1 text-left text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 pl-5"
                                >
                                  &bull; In Progress
                                </button>
                              )}
                              {col.id !== "completed" && (
                                <button
                                  onClick={(e) => moveTaskStatus(task, "completed", e)}
                                  className="w-full px-3 py-1 text-left text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 pl-5"
                                >
                                  &bull; Completed
                                </button>
                              )}
                              {col.id !== "overdue" && (
                                <button
                                  onClick={(e) => moveTaskStatus(task, "overdue", e)}
                                  className="w-full px-3 py-1 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 pl-5"
                                >
                                  &bull; Overdue
                                </button>
                              )}

                              <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

                              <button
                                onClick={(e) => {
                                  handleToggleFavorite(task.id, e);
                                  setActiveMenuTaskId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                <Star size={13} className={task.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-400"} />
                                <span>{task.isFavorite ? "Remove Favorite" : "Add to Favorites"}</span>
                              </button>
                              <button
                                onClick={(e) => handleArchive(task.id, e)}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                <Archive size={13} />
                                <span>Archive Task</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(task.id, e)}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                <Trash2 size={13} />
                                <span>Delete Task</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {task.title}
                      </h4>

                      {/* Description Preview */}
                      {task.description && (
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata Row 1: Due Date & Attachment Count */}
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Calendar size={12} className="text-gray-400" />
                            {formatDisplayDate(task.dueDate)}
                          </span>
                          {task.attachmentCount > 0 && (
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Paperclip size={12} className="text-gray-400" />
                              {task.attachmentCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metadata Row 2: Assignee Avatar + Category Pill + Favorite Star */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#0f1f38] dark:bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {user.initials || "AK"}
                          </div>
                          {renderCategoryBadge(task.category)}
                        </div>

                        {/* Favorite Star Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(task.id, e)}
                          className="p-1 rounded-md text-gray-300 dark:text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                          title={task.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star
                            size={14}
                            className={task.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-slate-600 hover:text-amber-400"}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= LIST VIEW ================= */
        <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-2xs divide-y divide-gray-100 dark:divide-slate-800">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen size={36} className="mx-auto text-gray-300 dark:text-slate-600 mb-2" />
              <h4 className="text-sm font-bold text-gray-700 dark:text-slate-200">No tasks found</h4>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                No tasks match your active filters. Click "Add Task" to create your next study milestone.
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
                  className={`py-3.5 px-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group ${
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
                          className={`text-xs sm:text-sm font-bold truncate ${
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
                        {renderCategoryBadge(task.category)}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges, Due Date, Favorite, Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden md:inline-block text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      {task.course}
                    </span>

                    {renderPriorityBadge(task.priority)}

                    {task.attachmentCount > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <Paperclip size={11} />
                        {task.attachmentCount}
                      </span>
                    )}

                    <span
                      className={`text-[11px] font-medium hidden sm:inline-block ${
                        isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-gray-500 dark:text-slate-400"
                      }`}
                    >
                      {formatDisplayDate(task.dueDate)}
                    </span>

                    {/* Favorite star */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(task.id, e)}
                      className="p-1 rounded-md text-gray-300 dark:text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                      title={task.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        size={14}
                        className={task.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-slate-600 hover:text-amber-400"}
                      />
                    </button>

                    {/* Edit / Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleEdit(task, e)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(task.id, e)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
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
      )}

      {/* 5. TASK CREATE / EDIT MODAL */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />

      {/* 6. TASK DETAIL MODAL */}
      {selectedTaskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200/90 dark:border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                    {selectedTaskDetails.course}
                  </span>
                  {renderCategoryBadge(selectedTaskDetails.category)}
                </div>
                <h3 className="text-base font-bold text-[#0f1f38] dark:text-white mt-1">
                  {selectedTaskDetails.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavoriteTask(selectedTaskDetails.id)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  title="Toggle Favorite"
                >
                  <Star
                    size={16}
                    className={selectedTaskDetails.isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-400"}
                  />
                </button>
                <button
                  onClick={() => setSelectedTaskDetails(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/70 p-4 rounded-2xl space-y-2 text-xs text-gray-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100 capitalize">
                  {selectedTaskDetails.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  {formatDisplayDate(selectedTaskDetails.dueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100 capitalize">
                  {selectedTaskDetails.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  {selectedTaskDetails.category || "Personal"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Attachments:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  {selectedTaskDetails.attachmentCount || 0} file(s)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Origin:</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  {selectedTaskDetails.isAssigned ? "Faculty Assigned Coursework" : "Personal Student Milestone"}
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
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleEdit(selectedTaskDetails);
                    setSelectedTaskDetails(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 cursor-pointer"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    toggleTaskStatus(selectedTaskDetails.id);
                    setSelectedTaskDetails(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] dark:bg-blue-600 text-white hover:bg-[#1a2e4f] cursor-pointer"
                >
                  {selectedTaskDetails.status === "completed" ? "Mark Pending" : "Mark Completed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
