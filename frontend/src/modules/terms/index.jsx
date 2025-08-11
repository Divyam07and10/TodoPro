"use client"

import TermsView from "./view"

export default function TermsPageModule() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      icon: "FileText",
      title: "Acceptance of Terms",
      content: [
        "By accessing and using TodoPro, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service.",
      ],
    },
    {
      icon: "Users",
      title: "User Accounts",
      content: [
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
      ],
    },
    {
      icon: "Shield",
      title: "Acceptable Use",
      content: [
        "You may use TodoPro only for lawful purposes and in accordance with these terms.",
        "You agree not to use the service to store or share illegal content.",
        "You agree not to interfere with the proper functioning of the service.",
        "Any unauthorized use may result in termination of your account.",
      ],
    },
    {
      icon: "Gavel",
      title: "Intellectual Property",
      content: [
        "TodoPro and its original content, features, and functionality are owned by TodoPro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
        "You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our service, except as generally permitted.",
      ],
    },
  ]

  return (
    <TermsView
      lastUpdated={lastUpdated}
      sections={sections}
    />
  )
}
