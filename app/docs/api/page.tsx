import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function APIPage() {
  const apiSections = [
    {
      title: "Core Types",
      description: "Essential types and structures",
      items: [
        { name: "Request", description: "HTTP request handling", href: "/docs/api/request" },
        { name: "Response", description: "HTTP response management", href: "/docs/api/response" },
        { name: "SqurlMux", description: "Main server multiplexer", href: "/docs/api/squrlmux" },
        { name: "HandlerFunc", description: "Request handler function type", href: "/docs/api/handler" },
      ],
    },
    {
      title: "Middleware",
      description: "Request processing pipeline",
      items: [
        { name: "Middleware Type", description: "Middleware function signature", href: "/docs/api/middleware" },
        {
          name: "Built-in Middlewares",
          description: "Logger, Recover, and more",
          href: "/docs/api/built-in-middleware",
        },
      ],
    },
    {
      title: "Utilities",
      description: "Helper functions and utilities",
      items: [
        { name: "Cookies", description: "Cookie handling utilities", href: "/docs/api/cookies" },
        { name: "Static Files", description: "Serve static content", href: "/docs/api/static" },
        { name: "Server Functions", description: "Core server functions", href: "/docs/api/functions" },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">API Reference</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
        <p className="text-xl text-muted-foreground">
          Complete reference documentation for all Squirrel Framework types, methods, and functions.
        </p>
      </div>

      <div className="space-y-8">
        {apiSections.map((section) => (
          <section key={section.title} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <Card key={item.name} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all"
                    >
                      View documentation <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Reference</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Basic server setup
server := SpawnServer()

// Route handlers
server.Get("/path", handler)
server.Post("/path", handler)
server.Put("/path", handler)
server.Delete("/path", handler)

// Middleware
server.Use(middleware)

// Start server
server.Listen(":8080")`}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}
