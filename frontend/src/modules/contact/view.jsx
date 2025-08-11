import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const iconMap = {
  Mail: Mail,
  Phone: Phone,
  MapPin: MapPin,
  MessageCircle: MessageCircle,
  Clock: Clock,
}

export default function ContactView({ contactInfo, officeLocation }) {
  const OfficeLocationIcon = iconMap[officeLocation.icon]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            We're here to help! Choose the best way to reach us.
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Contact Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = iconMap[info.icon]
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>{info.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">
                      {info.details}
                    </p>
                    <Badge
                      variant="secondary"
                      className="flex items-center justify-center space-x-1 mx-auto w-fit"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{info.responseTime}</span>
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Location</h2>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <OfficeLocationIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>{officeLocation.title}</CardTitle>
              <p className="text-gray-600">{officeLocation.description}</p>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-900 mb-2">
                {officeLocation.details}
              </p>
              <p className="text-sm text-gray-500">
                {officeLocation.additionalInfo}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
