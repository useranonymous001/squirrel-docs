import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Terminal } from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to install and set up Squirrel Framework in your Go project.
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Prerequisites</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Go 1.22+</Badge>
            <Badge variant="outline">Git</Badge>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Make sure you have Go 1.22 or later installed on your system. You can check your Go version with{" "}
              <code className="bg-muted px-1 py-0.5 rounded">go version</code>.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Installation</h2>
          <p className="text-muted-foreground">Install Squirrel Framework using Go modules:</p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Terminal</span>
            </div>
            <pre className="text-sm">
              <code>go get github.com/useranonymous001/squirrel</code>
            </pre>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your First Server</h2>
          <p className="text-muted-foreground">Create a simple HTTP server with Squirrel Framework:</p>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Server</TabsTrigger>
              <TabsTrigger value="json">JSON API</TabsTrigger>
              <TabsTrigger value="middleware">With Middleware</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-6">
                <pre className="text-sm overflow-x-auto">
                  <code>{`package main

import "github.com/useranonymous001/squirrel"

func main() {
    // Create a new server instance
    server := SpawnServer()
    
    // Define a simple route
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Hello, World!")
        res.Send()
    })
    
    // Start the server
    server.Listen(":8080")
}`}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-6">
                <pre className="text-sm overflow-x-auto">
                  <code>{`package main

import "github.com/useranonymous001/squirrel"

func main() {
    server := SpawnServer()
    
    // JSON response
    server.Get("/api/users", func(req *Request, res *Response) {
        users := []map[string]interface{}{
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
        }
        
        res.JSON(users)
        res.Send()
    })
    
    // Handle POST requests
    server.Post("/api/users", func(req *Request, res *Response) {
        body, err := req.ReadBodyAsString()
        if err != nil {
            res.SetStatus(400)
            res.JSON(map[string]string{"error": "Invalid request body"})
            res.Send()
            return
        }
        
        res.SetStatus(201)
        res.JSON(map[string]string{"message": "User created", "body": body})
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="middleware" className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-6">
                <pre className="text-sm overflow-x-auto">
                  <code>{`package main

import (
    "github.com/useranonymous001/squirrel"
    "github.com/useranonymous001/squirrel/middlewares"
)

func main() {
    server := SpawnServer()
    
    // Add global middleware
    server.Use(middlewares.Logger)
    
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]string{
            "message": "Hello with middleware!",
            "timestamp": time.Now().Format(time.RFC3339),
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Running Your Server</h2>
          <p className="text-muted-foreground">
            Save your code to <code className="bg-muted px-1 py-0.5 rounded">main.go</code> and run:
          </p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <pre className="text-sm">
              <code>go run main.go</code>
            </pre>
          </div>
          <p className="text-muted-foreground">
            Your server will start on <code className="bg-muted px-1 py-0.5 rounded">http://localhost:8080</code>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Next Steps</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              • Learn about{" "}
              <a href="/docs/api/request" className="text-blue-600 hover:underline">
                Request handling
              </a>
            </li>
            <li>
              • Explore{" "}
              <a href="/docs/api/response" className="text-blue-600 hover:underline">
                Response methods
              </a>
            </li>
            <li>
              • Understand{" "}
              <a href="/docs/guides/routing" className="text-blue-600 hover:underline">
                Routing patterns
              </a>
            </li>
            <li>
              • Add{" "}
              <a href="/docs/guides/middleware" className="text-blue-600 hover:underline">
                Middleware
              </a>{" "}
              to your application
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
