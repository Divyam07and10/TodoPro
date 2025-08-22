import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, AlertTriangle, Users, Shield, Gavel } from "lucide-react"

const iconMap = {
  FileText: FileText,
  Users: Users,
  Shield: Shield,
  Gavel: Gavel,
  AlertTriangle: AlertTriangle,
  Scale: Scale,
}

export default function TermsView({ lastUpdated, sections, additionalTerms }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Last Updated: <Badge variant="secondary">{lastUpdated}</Badge>
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
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-600 text-sm">
                        {paragraph}
                      </p>
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
              <Scale className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Acknowledgment
                </h3>
                <p className="text-blue-800 text-sm">
                  By using TodoPro, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
                  You also acknowledge that these terms may be updated from time
                  to time, and continued use of the service constitutes
                  acceptance of any modifications.
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
