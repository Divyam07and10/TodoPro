import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  User,
} from "lucide-react"

const iconMap = {
  HelpCircle: HelpCircle,
  BookOpen: BookOpen,
  MessageCircle: MessageCircle,
  Mail: Mail,
  Phone: Phone,
  Clock: Clock,
  User: User,
}

export default function HelpView({ faqCategories, contactOptions }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How Can We Help?
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions or contact our support team.
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqCategories.map((category, index) => {
              const Icon = iconMap[category.icon]
              return (
                <div key={index}>
                  <div className="flex items-center space-x-3 mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.questions.map((faq, faqIndex) => (
                      <Card
                        key={faqIndex}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {faq.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Still Need Help?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = iconMap[option.icon]
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>{option.title}</CardTitle>
                    <p className="text-gray-600">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-2">
                      {option.contact}
                    </p>
                    <Badge
                      variant="secondary"
                      className="flex items-center justify-center space-x-1"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{option.responseTime}</span>
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
