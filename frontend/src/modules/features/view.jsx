import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckSquare,
  Calendar,
  AlertTriangle,
  Tag,
  Filter,
  Clock,
  Users,
  Smartphone,
  BarChart3,
} from "lucide-react"

const iconMap = {
  CheckSquare: CheckSquare,
  Calendar: Calendar,
  AlertTriangle: AlertTriangle,
  Tag: Tag,
  Filter: Filter,
  Clock: Clock,
  Users: Users,
  Smartphone: Smartphone,
  BarChart3: BarChart3,
}

export default function FeaturesView({ features }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Powerful Features for Peak Productivity
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to organize your life and get things done.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            return (
              <Card
                key={index}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div
                    className={`p-3 rounded-full w-fit mb-4 ${feature.color} bg-opacity-20`}
                  >
                    <Icon className={`h-8 w-8 text-white ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-blue-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6">
            Join thousands of users who have transformed their productivity with
            TodoPro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-blue-600 bg-white">
              ✨ Free to use
            </Badge>
            <Badge variant="secondary" className="text-blue-600 bg-white">
              🚀 No setup required
            </Badge>
            <Badge variant="secondary" className="text-blue-600 bg-white">
              📱 Works everywhere
            </Badge>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
