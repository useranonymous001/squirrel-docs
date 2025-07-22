import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Book, Code, Zap } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">v1.0.0</Badge>
          <Badge variant="outline">Go 1.22+</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to build fast and scalable web applications with Squirrel Framework.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <CardTitle>Getting Started</CardTitle>
            </div>
            <CardDescription>Quick introduction to Squirrel Framework and basic concepts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/docs/getting-started"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all"
            >
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-600" />
              <CardTitle>API Reference</CardTitle>
            </div>
            <CardDescription>Complete reference for all types, methods, and functions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/docs/api"
              className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 group-hover:gap-3 transition-all"
            >
              Browse API <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-600" />
              <CardTitle>Guides</CardTitle>
            </div>
            <CardDescription>In-depth guides covering routing, middleware, and advanced topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/docs/guides"
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 group-hover:gap-3 transition-all"
            >
              Read guides <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Quick Example</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`package main

import "github.com/useranonymous001/squirrel"

func main() {
    server := SpawnServer()
    
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]string{
            "message": "Hello, Squirrel!",
            "version": "1.0.0",
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
