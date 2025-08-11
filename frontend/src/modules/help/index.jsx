"use client"

import HelpView from "./view"

export default function HelpPageModule() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: "BookOpen",
      questions: [
        {
          question: "How do I create my first todo?",
          answer:
            "Click the 'Add Todo' button on your dashboard, fill in the title, description, priority, category, and due date, then click 'Create Todo'.",
        },
        {
          question: "How do I sign up for an account?",
          answer: "To sign up for an account, go to the sign-in page and click on the 'Continue with Google' button. You'll be prompted to select an existing Google account or enter the details of the Gmail account you want to use. Once authenticated, your account will be automatically created and linked to your Google credentials."
        },
      ],
    },
    {
      title: "Task Management",
      icon: "HelpCircle",
      questions: [
        {
          question: "How do I edit a todo?",
          answer:
            "Click the edit icon (pencil) on any todo card to open the edit dialog. Make your changes and click 'Update Todo'.",
        },
        {
          question: "What are the different priority levels?",
          answer:
            "TodoPro supports three priority levels: High (red), Medium (yellow), and Low (green). These help you organize your tasks by importance.",
        },
        {
          question: "How can I filter and sort my todos?",
          answer:
            "On the dashboard, you can filter todos by status (completed, pending, overdue) and category. You can also sort them by due date or priority.",
        },
      ],
    },
    {
      title: "Account & Billing",
      icon: "User",
      questions: [
        {
          question: "How do I change my profile information?",
          answer:
            "Navigate to the 'Profile' page, click 'Edit Profile', make your changes, and save. You can update your name, email, and profile picture.",
        },
        {
          question: "Is TodoPro free to use?",
          answer:
            "Yes, TodoPro is a free to use app.",
        },
      ],
    },
    {
      title: "Technical Support",
      icon: "MessageCircle",
      questions: [
        {
          question: "The app is not loading correctly.",
          answer:
            "Try clearing your browser cache and cookies, or try a different browser. If the issue persists, please contact support with details.",
        },
        {
          question: "Where can I report a bug or suggest a feature?",
          answer:
            "You can use the 'Contact Support' form below or email us directly at support@todopro.com. We appreciate your feedback!",
        },
      ],
    },
  ]

  const contactOptions = [
    {
      icon: "Mail",
      title: "Email Support",
      description: "Get help via email. We aim to respond within 24 hours.",
      contact: "support@todopro.com",
      responseTime: "24 hours",
    },
    {
      icon: "Phone",
      title: "Phone Support",
      description:
        "Speak directly with a support agent. Available during business hours.",
      contact: "+1 (555) 123-4567",
      responseTime: "Immediate",
    },
    {
      icon: "MessageCircle",
      title: "Live Chat",
      description:
        "Chat with our support team for quick assistance during business hours.",
      contact: "Available 9 AM - 5 PM EST",
      responseTime: "< 5 minutes",
    },
  ]

  return (
    <HelpView faqCategories={faqCategories} contactOptions={contactOptions} />
  )
}
