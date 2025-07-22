import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function QuickStartSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Quick Start</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Your First Squirrel Server</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create a powerful web server with just a few lines of code
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Server</TabsTrigger>
              <TabsTrigger value="json">JSON API</TabsTrigger>
              <TabsTrigger value="middleware">With Middleware</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    Hello World Server
                  </CardTitle>
                  <CardDescription>A simple HTTP server that responds with &quote;Hello, World!&quote;</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-6 overflow-x-auto">
                    <pre className="text-sm">
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
    
    // Start the server on port 8080
    server.Listen(":8080")
}`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    JSON API Server
                  </CardTitle>
                  <CardDescription>Handle JSON requests and responses with built-in methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-6 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`package main

import "github.com/useranonymous001/squirrel"

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func main() {
    server := SpawnServer()
    
    // GET endpoint returning JSON
    server.Get("/api/users", func(req *Request, res *Response) {
        users := []User{
            {ID: 1, Name: "John Doe", Email: "john@example.com"},
            {ID: 2, Name: "Jane Smith", Email: "jane@example.com"},
        }
        
        res.JSON(users)
        res.Send()
    })
    
    // POST endpoint accepting JSON
    server.Post("/api/users", func(req *Request, res *Response) {
        body, err := req.ReadBodyAsString()
        if err != nil {
            res.SetStatus(400)
            res.JSON(map[string]string{"error": "Invalid request"})
            res.Send()
            return
        }
        
        res.SetStatus(201)
        res.JSON(map[string]string{
            "message": "User created successfully",
            "data": body,
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="middleware" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-purple-600" />
                    Server with Middleware
                  </CardTitle>
                  <CardDescription>Add logging and error recovery middleware to your server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-6 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`package main

import (
    "github.com/useranonymous001/squirrel"
    "github.com/useranonymous001/squirrel/middlewares"
    "time"
)

func main() {
    server := SpawnServer()
    
    // Add global middleware
    server.Use(middlewares.Logger)
    
    // Custom middleware example
    server.Use(func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            start := time.Now()
            
            // Call the next handler
            next(req, res)
            
            // Log request duration
            duration := time.Since(start)
            fmt.Printf("Request took: %v\\n", duration)
        }
    })
    
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]interface{}{
            "message": "Hello with middleware!",
            "timestamp": time.Now().Format(time.RFC3339),
        })
        res.Send()
    })
    
    // Route with specific middleware
    server.Get("/protected", func(req *Request, res *Response) {
        res.JSON(map[string]string{"message": "Protected route"})
        res.Send()
    }, authMiddleware)
    
    server.Listen(":8080")
}

func authMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        token := req.GetCookie("auth_token")
        if token == nil {
            res.SetStatus(401)
            res.JSON(map[string]string{"error": "Unauthorized"})
            res.Send()
            return
        }
        next(req, res)
    }
}`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link href="/docs/getting-started">
                View Full Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
