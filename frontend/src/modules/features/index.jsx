"use client"

import FeaturesView from "./view"

export default function FeaturesPageModule() {
  const features = [
    {
      icon: "CheckSquare",
      title: "Task Management",
      description:
        "Create, edit, and organize your tasks with ease. Add detailed descriptions, set due dates, and track your progress.",
      benefits: [
        "Create unlimited tasks",
        "Rich text descriptions",
        "Due date tracking",
        "Progress monitoring",
      ],
      color: "bg-blue-500",
    },
    {
      icon: "Calendar",
      title: "Calendar View",
      description:
        "Visualize your tasks in a beautiful calendar interface. See your schedule at a glance and plan ahead.",
      benefits: [
        "Monthly calendar view",
        "Drag & drop scheduling",
        "Visual task overview",
        "Date-based filtering",
      ],
      color: "bg-green-500",
    },
    {
      icon: "AlertTriangle",
      title: "Priority Levels",
      description:
        "Organize tasks by importance with our three-tier priority system. Focus on what matters most.",
      benefits: [
        "High, Medium, Low priorities",
        "Color-coded indicators",
        "Priority-based sorting",
        "Focus on critical tasks",
      ],
      color: "bg-red-500",
    },
    {
      icon: "Tag",
      title: "Categories & Tags",
      description:
        "Categorize and tag your todos for better organization and quick retrieval. Keep your tasks neatly grouped.",
      benefits: [
        "Customizable categories",
        "Multiple tags per task",
        "Easy filtering by category/tag",
        "Enhanced organization",
      ],
      color: "bg-purple-500",
    },
    {
      icon: "Filter",
      title: "Advanced Filtering",
      description:
        "Quickly find specific tasks using powerful filtering options by status, due date, priority, and category.",
      benefits: [
        "Filter by completion status",
        "Filter by due date ranges",
        "Combine multiple filters",
        "Save custom filter views",
      ],
      color: "bg-yellow-500",
    },
    {
      icon: "Clock",
      title: "Reminders & Notifications",
      description:
        "Set timely reminders for your tasks. Get notified so you never miss a deadline or important event.",
      benefits: [
        "Email notifications",
        "In-app reminders",
        "Customizable reminder times",
        "Stay on track effortlessly",
      ],
      color: "bg-indigo-500",
    },
    {
      icon: "Users",
      title: "Collaboration (Coming Soon)",
      description:
        "Share tasks and collaborate with team members. Assign tasks, track shared progress, and communicate effectively.",
      benefits: [
        "Share tasks with others",
        "Assign tasks to team members",
        "Real-time collaboration",
        "Shared project views",
      ],
      color: "bg-pink-500",
    },
    {
      icon: "Smartphone",
      title: "Cross-Device Sync",
      description:
        "Access your todos from anywhere, on any device. Your data syncs seamlessly across desktop, tablet, and mobile.",
      benefits: [
        "Web, tablet, and mobile access",
        "Automatic cloud sync",
        "Offline mode support",
        "Consistent experience everywhere",
      ],
      color: "bg-teal-500",
    },
    {
      icon: "BarChart3",
      title: "Productivity Insights",
      description:
        "Gain valuable insights into your productivity with detailed statistics and progress reports. Understand your habits.",
      benefits: [
        "Completion rate tracking",
        "Overdue task reports",
        "Category-wise breakdown",
        "Performance trends",
      ],
      color: "bg-orange-500",
    },
  ]

  return <FeaturesView features={features} />
}
