# StudyDeck — Academic Task & Workload Management Platform

A modern, responsive student task and deadline management platform built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, recreating the exact UI/UX design references from project screenshots.

---

## 🎨 Design Mapping to Reference Images

| Feature / Page | Reference Image | Implementation Highlights |
| :--- | :--- | :--- |
| **Student Dashboard** (`/dashboard`) | `media_1791997022707_394feb21.png` | 4 summary cards (`40` Total, `12` Pending, `24` Completed, `4` Overdue), Assignment Completion semi-circular gauge (`85%`), On-time Submission (`78%`) with diagonal hatched pattern, Average Grade (`84.7%`) with course breakdown bars, Weekly Productivity 7-day pill bars with percentages, Upcoming Deadlines table with status pills. |
| **Sign In** (`/login`) | `media_1791997036426_5903c3f3.png` | Split card container with left dark navy hero showing 3 role cards (Student, Faculty, Chairman) and right sign-in form with email, password toggle, "Keep me signed in", and one-click Prototype Shortcuts. |
| **My Profile** (`/profile`) | `media_1791997077214_f2b50371.png` | Dark navy circular "AK" avatar, B.Tech Year 2 badge, form grid with Full Name, Programme, Year, and Email, editable with live validation. |
| **My Progress** (`/progress`) | `media_1791997109112_90b4ff57.png` | 4 summary metric cards (Average Grade 84.7%, Completion 85%, On-time 78%, Tasks Done 60%), Course Grades progress bars, and Mon–Fri Weekly Productivity horizontal progress bars. |
| **Notifications** (`/notifications`) | `media_1791997139798_4dd3a20b.png` | 4 top cards (Unread 4, Overdue alerts 1, Reminders 1, Feedback 1), recent notifications list with blue indicator dots and mark-all-as-read action. |
| **My Tasks** (`/tasks`) | Harmonized Design System | Filter tabs (All, Pending, Overdue, Completed, Assigned, Personal), priority filter, Add Task modal, Edit Task, Delete Task, interactive checkbox status toggle, and detailed drawer view. |
| **Assignments** (`/assignments`) | Harmonized Design System | Coursework submission cards, instructor feedback boxes on revision-needed assignments, status filters, and interactive submission modal with drag-and-drop file upload. |
| **Calendar** (`/calendar`) | Harmonized Design System | Monthly calendar grid for academic scheduling (October 2026), previous/next month navigation, Today shortcut, event badges, and selected day schedule drawer. |
| **Landing Page** (`/`) | Harmonized Design System | High-conversion academic portal homepage with hero section, live interactive dashboard preview, role showcase (Student, Faculty, Chairman), productivity benchmarks, and CTA buttons. |
| **Settings** (`/settings`) | Harmonized Design System | Notification preference toggles (email alerts, deadline reminders, feedback notices, weekly digest), password security update form with validation, and prototype data reset. |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### 2. Run the Development Server
```bash
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧭 Routes & Navigation

- `/` — Landing Page
- `/login` — Sign In Page (with 1-click Student, Faculty, Chairman prototype logins)
- `/register` — Account Registration
- `/dashboard` — Student Dashboard (matches reference screenshot pixel for pixel)
- `/tasks` — My Tasks
- `/assignments` — Assignments & Coursework Submissions
- `/calendar` — Academic Calendar
- `/notifications` — Notifications & Alerts
- `/progress` — My Progress & Academic Standing
- `/profile` — Student Profile Details
- `/settings` — Account & Notification Preferences

---

## 💡 Key Features & Reactive Architecture

1. **Shared State & Reactivity (`StudyDeckContext`)**:
   - Task additions, deletions, and status toggles immediately recalculate task completion rates, pending counts, and progress metrics across the entire application.
   - Assignment submissions immediately update the submission count, the semi-circle gauge percentage, and automatically generate a new submission notification.
   - Profile edits immediately update the TopNav avatar and user information.

2. **Pixel-Accurate Visual Components**:
   - Exact 3-bar stacked StudyDeck logo SVG icon.
   - Custom SVG semi-circular gauge matching the 85% assignment completion arc.
   - Custom diagonal hatched stripe pattern (`bg-striped-pattern`) matching the pending/remaining charts.
   - Status badges matching the dark navy and bordered outline pills from the screenshots.
   - Framed Screenshot View vs Full Screen View toggle.
