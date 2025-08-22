"use client"

import PrivacyView from "./view"

export default function PrivacyPageModule() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      icon: "Database",
      title: "Information We Collect",
      content: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your name, email address, and your google profile image.",
        },
        {
          subtitle: "Todo Data",
          text: "We store the todos you create, including titles, descriptions, due dates, createdAt date, updatedAt date, priorities, and categories.",
        },
      ],
    },
    {
      icon: "Eye",
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our todo management service.",
        },
        {
          subtitle: "Communication",
          text: "We may use your email to send important service updates, security alerts, and support responses.",
        },
        {
          subtitle: "Improvement and Analysis",
          text: "Usage data helps us understand user behavior to improve features and user experience.",
        },
      ],
    },
    {
      icon: "Lock",
      title: "How We Protect Your Information",
      content: [
        {
          subtitle: "Data Encryption",
          text: "All data is encrypted in transit and at rest using industry-standard protocols.",
        },
        {
          subtitle: "Access Control",
          text: "Access to your personal data is restricted to authorized personnel only.",
        },
        {
          subtitle: "Regular Audits",
          text: "We conduct regular security audits and penetration tests to identify and fix vulnerabilities.",
        },
      ],
    },
    {
      icon: "UserCheck",
      title: "Your Choices and Rights",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You can access and update your profile information at any time through your account settings.",
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your data in a structured, commonly used, and machine-readable format.",
        },
      ],
    },
  ]

  return <PrivacyView lastUpdated={lastUpdated} sections={sections} />
}
