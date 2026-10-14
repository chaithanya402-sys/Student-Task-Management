import React, { useState } from "react";
import { Plus, Check, Trash2, Edit2, Clock, AlertCircle, BookOpen, CheckCircle2 } from "lucide-react";
import { useStudyDeck } from "../context/StudyDeckContext";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { TaskModal } from "../components/common/TaskModal";

export const TasksPage = () => {
  const {
    tasks,
    stats,
    toggleTaskStatus,
    deleteTask,
    searchQuery,
    activeFilter
  } = useStudyDeck();

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

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card dark className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-white/80">Total Tasks</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {stats.totalTasks}
            </span>
          </div>
          <span className="text-xs text-white/70">
            {stats.personalTasks} personal, {stats.assignedTasks} assigned
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Pending</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.pendingTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">5 due within 7 days</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Completed</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.completedTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">{stats.taskCompletionRate}% of all tasks</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-[120px]">
          <span className="text-xs font-medium text-gray-500">Overdue</span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1f38]">
              {stats.overdueTasks}
            </span>
          </div>
          <span className="text-xs text-gray-500">Needs attention</span>
        </Card>
      </div>

      {/* 2. TASK CONTROLS & TABS */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-100/80 p-1 rounded-xl text-xs">
            {[
              { id: "all", label: `All (${stats.totalTasks})` },
              { id: "pending", label: `Pending (${stats.pendingTasks})` },
              { id: "overdue", label: `Overdue (${stats.overdueTasks})` },
              { id: "completed", label: `Completed (${stats.completedTasks})` },
              { id: "assigned", label: `Assigned (${stats.assignedTasks})` },
              { id: "personal", label: `Personal (${stats.personalTasks})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-[#0f1f38] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-white text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* 3. TASK LIST */}
        <div className="divide-y divide-gray-100 pt-2">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen size={36} className="mx-auto text-gray-300 mb-2" />
              <h4 className="text-sm font-bold text-gray-700">No tasks found</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No items match your active search or filters. Click "Add Task" to create your next study milestone.
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] cursor-pointer"
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
                  className={`py-3.5 px-2 sm:px-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors rounded-xl cursor-pointer group ${
                    isDone ? "opacity-60 bg-gray-50/40" : ""
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
                          ? "bg-[#0f1f38] border-[#0f1f38] text-white"
                          : "border-gray-300 hover:border-[#0f1f38] bg-white"
                      }`}
                    >
                      {isDone && <Check size={13} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isDone ? "line-through text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.isAssigned && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Assigned
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-md">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] text-gray-500 font-medium">
                      {task.course}
                    </span>

                    <Badge status={task.priority} size="sm" />

                    <span
                      className={`text-[11px] font-medium hidden md:inline-block ${
                        isOverdue ? "text-red-600 font-bold" : "text-gray-500"
                      }`}
                    >
                      {task.dueDate}
                    </span>

                    <Badge status={task.status} size="sm" />

                    {/* Edit / Delete Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-2">
                      <button
                        onClick={(e) => handleEdit(task, e)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-md transition-colors"
                        title="Edit task"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(task.id, e)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  {selectedTaskDetails.course}
                </span>
                <h3 className="text-base font-bold text-[#0f1f38] mt-0.5">
                  {selectedTaskDetails.title}
                </h3>
              </div>
              <Badge status={selectedTaskDetails.status} />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="font-semibold text-gray-900">{selectedTaskDetails.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <span className="font-semibold text-gray-900 capitalize">{selectedTaskDetails.priority}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold text-gray-900">
                  {selectedTaskDetails.isAssigned ? "Faculty Assigned Coursework" : "Personal Study Task"}
                </span>
              </div>
            </div>

            {selectedTaskDetails.description && (
              <div>
                <span className="text-xs font-semibold text-gray-700">Description:</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {selectedTaskDetails.description}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  toggleTaskStatus(selectedTaskDetails.id);
                  setSelectedTaskDetails(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
              >
                {selectedTaskDetails.status === "completed" ? "Mark Pending" : "Mark Completed"}
              </button>
              <button
                onClick={() => setSelectedTaskDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1f38] text-white hover:bg-[#1a2e4f] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
