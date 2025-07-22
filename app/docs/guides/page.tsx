import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Code, Shield, Zap, FileText, Globe } from "lucide-react"

export default function GuidesPage() {
  const guides = [
    {
      title: "Routing",
      description: "Learn how to define routes, handle path parameters, and organize your application's URL structure.",
      icon: Globe,
      href: "/docs/guides/routing",
      topics: ["Path Parameters", "Route Groups", "Wildcards", "HTTP Methods"],
      difficulty: "Beginner",
    },
    {
      title: "Middleware",
      description:
        "Understand how to use middleware for cross-cutting concerns like authentication, logging, and CORS.",
      icon: Shield,
      href: "/docs/guides/middleware",
      topics: ["Custom Middleware", "Built-in Middleware", "Middleware Chain", "Error Handling"],
      difficulty: "Intermediate",
    },
    {
      title: "Request Handling",
      description: "Master request processing, including parsing forms, handling JSON, and working with headers.",
      icon: Code,
      href: "/docs/guides/request-handling",
      topics: ["Form Data", "JSON Parsing", "File Uploads", "Headers"],
      difficulty: "Beginner",
    },
    {
      title: "Response Management",
      description: "Learn how to send different types of responses, set headers, and handle content negotiation.",
      icon: FileText,
      href: "/docs/guides/response-management",
      topics: ["JSON Responses", "Templates", "Status Codes", "Headers"],
      difficulty: "Beginner",
    },
    {
      title: "Error Handling",
      description: "Implement robust error handling strategies and create user-friendly error pages.",
      icon: Zap,
      href: "/docs/guides/error-handling",
      topics: ["Custom Errors", "Error Middleware", "Recovery", "Logging"],
      difficulty: "Intermediate",
    },
    {
      title: "Static Files",
      description: "Serve static assets like CSS, JavaScript, and images efficiently with Squirrel.",
      icon: Book,
      href: "/docs/guides/static-files",
      topics: ["File Server", "Asset Pipeline", "Caching", "Compression"],
      difficulty: "Beginner",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Guides</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Comprehensive guides to help you master Squirrel web development. From basic concepts to advanced patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <Card key={guide.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                    <Badge className={`mt-1 ${getDifficultyColor(guide.difficulty)}`}>{guide.difficulty}</Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base mt-3">{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <a href={guide.href} className="inline-flex items-center text-primary hover:underline font-medium">
                  Read Guide →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Path</CardTitle>
          <CardDescription>Recommended order for learning Squirrel concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Start with Routing</h4>
                <p className="text-sm text-muted-foreground">
                  Learn the basics of defining routes and handling requests
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Request & Response Handling</h4>
                <p className="text-sm text-muted-foreground">Master processing requests and sending responses</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Add Middleware</h4>
                <p className="text-sm text-muted-foreground">
                  Implement cross-cutting concerns like authentication and logging
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Error Handling & Static Files</h4>
                <p className="text-sm text-muted-foreground">
                  Build robust applications with proper error handling and asset serving
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
