import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react"

const iconMap = {
  Shield: Shield,
  Eye: Eye,
  Lock: Lock,
  UserCheck: UserCheck,
  Database: Database,
  Globe: Globe,
}

export default function PrivacyView({ lastUpdated, sections }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your privacy matters to us. Learn how we collect, use, and protect
            your data.
            <Badge variant="secondary" className="ml-2">
              Last Updated: {lastUpdated}
            </Badge>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => {
            const Icon = iconMap[section.icon]
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-10 w-10 text-blue-600 mb-4" />
                  <CardTitle className="text-xl font-bold text-gray-900">
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h4>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Globe className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Policy Updates
                </h3>
                <p className="text-blue-800 text-sm">
                  We may update this privacy policy from time to time. When we
                  do, we'll notify you by email and update the "Last Updated"
                  date at the top of this page. We encourage you to review this
                  policy periodically to stay informed about how we protect your
                  information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
