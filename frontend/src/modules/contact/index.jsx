"use client"

import ContactView from "./view"

export default function ContactPageModule() {
  const contactInfo = [
    {
      icon: "Mail",
      title: "Email Support",
      details: "support@todopro.com",
      description: "Get help via email. We aim to respond to all inquiries within 24 hours.",
      responseTime: "24 hours",
    },
    {
      icon: "Phone",
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Speak directly with a support agent. Available during business hours.",
      responseTime: "Immediate",
    },
    {
      icon: "MessageCircle",
      title: "Live Chat",
      details: "Available 9 AM - 5 PM EST",
      description: "Chat with our support team for quick assistance during business hours.",
      responseTime: "< 5 minutes",
    },
  ]

  const officeLocation = {
    icon: "MapPin",
    title: "Our Office",
    details: "123 Productivity St, Suite 100",
    description: "San Francisco, CA 94105",
    additionalInfo: "Visits by appointment only.",
  }

  return (
    <ContactView contactInfo={contactInfo} officeLocation={officeLocation} />
  )
}
