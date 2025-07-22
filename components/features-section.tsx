import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Code, Layers, Cookie, FileText, Server, Globe, Lock, Gauge } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for performance with minimal overhead and optimized request handling.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      icon: Code,
      title: "Simple API",
      description: "Intuitive and familiar API design that feels natural to Go developers.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Layers,
      title: "Middleware Support",
      description: "Powerful middleware system for request processing and cross-cutting concerns.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Shield,
      title: "Built-in Recovery",
      description: "Automatic panic recovery and error handling to keep your server running smoothly.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      icon: Cookie,
      title: "Cookie Management",
      description: "Full cookie support with parsing, setting, and secure cookie handling.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: FileText,
      title: "Static File Serving",
      description: "Efficient static file serving with customizable paths and caching.",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      icon: Server,
      title: "HTTP Methods",
      description: "Support for all standard HTTP methods: GET, POST, PUT, DELETE, and more.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      icon: Globe,
      title: "URL Parameters",
      description: "Dynamic routing with URL parameters and query string parsing.",
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900",
    },
    {
      icon: Lock,
      title: "Secure by Default",
      description: "Security-focused design with safe defaults and best practices built-in.",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Squirrel Framework comes packed with features to build modern web applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
              <Gauge className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold text-lg">Production Ready</h3>
                <p className="text-muted-foreground">Battle-tested and ready for your next production application</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
