import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Terminal, Code, Zap } from "lucide-react"

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Get up and running with Squirrel in minutes. This guide will walk you through creating your first web server.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <Terminal className="w-3 h-3 mr-1" />
            CLI
          </Badge>
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            Go 1.19+
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />5 minutes
          </Badge>
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Make sure you have Go 1.19 or later installed on your system before proceeding.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Create a New Project
            </CardTitle>
            <CardDescription>Initialize a new Go module for your Squirrel application</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="terminal" className="w-full">
              <TabsList>
                <TabsTrigger value="terminal">Terminal</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              <TabsContent value="terminal">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`mkdir my-squirrel-app
cd my-squirrel-app
go mod init my-squirrel-app`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="explanation">
                <p className="text-sm text-muted-foreground">
                  This creates a new directory for your project and initializes a Go module. The module name can be
                  anything you want, but its common to use your project name.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Install Squirrel
            </CardTitle>
            <CardDescription>Add Squirrel as a dependency to your project</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>go get github.com/squirrel-land/squirrel</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </span>
              Create Your First Server
            </CardTitle>
            <CardDescription>Write a simple HTTP server using Squirrel</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Create a file called <code>main.go</code> and add the following code:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`package main

import (
    "fmt"
    "log"
    "net/http"
    
    "github.com/squirrel-land/squirrel"
)

func main() {
    // Create a new Squirrel mux
    mux := squirrel.NewSqurlMux()
    
    // Add a simple route
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, Squirrel! 🐿️")
    })
    
    // Add another route with path parameters
    mux.HandleFunc("/user/{id}", func(w http.ResponseWriter, r *http.Request) {
        id := squirrel.GetParam(r, "id")
        fmt.Fprintf(w, "User ID: %s", id)
    })
    
    // Start the server
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", mux))
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                4
              </span>
              Run Your Server
            </CardTitle>
            <CardDescription>Start your Squirrel application</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>go run main.go</code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">
              Your server should now be running on <code>http://localhost:8080</code>. Try visiting the following URLs:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <code>http://localhost:8080/</code> - Hello message
              </li>
              <li>
                • <code>http://localhost:8080/user/123</code> - User with ID 123
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎉 Congratulations!</CardTitle>
            <CardDescription>Youve successfully created your first Squirrel web server</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You now have a working web server with:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Basic routing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Path parameters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>HTTP request handling</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Continue learning with these guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Routing Guide</h4>
                <p className="text-sm text-muted-foreground mb-3">Learn advanced routing patterns and techniques</p>
                <a href="/docs/guides/routing" className="text-primary hover:underline text-sm">
                  Read the guide →
                </a>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Middleware</h4>
                <p className="text-sm text-muted-foreground mb-3">Add authentication, logging, and more</p>
                <a href="/docs/guides/middleware" className="text-primary hover:underline text-sm">
                  Learn middleware →
                </a>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">API Reference</h4>
                <p className="text-sm text-muted-foreground mb-3">Explore all available functions and types</p>
                <a href="/docs/api" className="text-primary hover:underline text-sm">
                  View API docs →
                </a>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Examples</h4>
                <p className="text-sm text-muted-foreground mb-3">See real-world applications and patterns</p>
                <a href="/docs/examples" className="text-primary hover:underline text-sm">
                  Browse examples →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
