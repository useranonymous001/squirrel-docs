import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function BasicServerExamplePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Example</Badge>
          <Badge variant="outline">Beginner</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Basic Server Example</h1>
        <p className="text-xl text-muted-foreground">A simple HTTP server demonstrating basic Squirrel functionality</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
        <p className="mb-4">Heres a complete basic server implementation:</p>
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`package main

import (
    "fmt"
    "log"
    "github.com/user001/squirrel"
)

func main() {
    // Create a new Squirrel mux

    mux := server.SpawnServer()
    
    // Define routes
    	mux.Get("/home", homeHandler)
	    mux.Get("/echo", echoHandler)
    
    // Start the server
    fmt.Println("Server starting on http://localhost:8080")
    log.Fatal(squirrel.ListenAndServe(":8080", mux))
}

// Home page handler
func homeHandler(w *squirrel.Response, r *squirrel.Request) {
    w.Header().Set("Content-Type", "text/html")
    w.WriteString(\`
        <html>
            <head><title>Squirrel Basic Server</title></head>
            <body>
                <h1>Welcome to Squirrel!</h1>
                <p>This is a basic server example.</p>
                <ul>
                    <li><a href="/hello">Hello World</a></li>
                    <li><a href="/hello/John">Hello John</a></li>
                    <li><a href="/api/status">API Status</a></li>
                </ul>
            </body>
        </html>
    \`)
}

// Simple hello handler
func helloHandler(w *squirrel.Response, r *squirrel.Request) {
    w.WriteString("Hello, World!")
}

// Hello with name parameter
func helloNameHandler(w *squirrel.Response, r *squirrel.Request) {
    name := r.PathValue("name")
    w.WriteString("Hello, " + name + "!")
}

// API status endpoint
func statusHandler(w *squirrel.Response, r *squirrel.Request) {
    status := map[string]interface{}{
        "status":  "ok",
        "version": "1.0.0",
        "message": "Server is running",
    }
    w.JSON(status)
}

// Echo endpoint that returns the request body
func echoHandler(w *squirrel.Response, r *squirrel.Request) {
    var data map[string]interface{}
    
    
    response := map[string]interface{}{
        "echo": data,
        "method": r.Method,
        "path": r.URL.Path,
    }
    
    w.JSON(response)
}`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Running the Example</h2>
        <p className="mb-4">To run this example:</p>
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`# Create a new Go module
go mod init basic-server-example

# Install Squirrel
go get github.com/useranonymous001/squirrel

# Save the code above as main.go and run
go run main.go`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Testing the Endpoints</h2>
        <p className="mb-4">Test the server with these curl commands:</p>
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`# Test the home page
curl http://localhost:8080/

# Test hello endpoint
curl http://localhost:8080/hello

# Test hello with name
curl http://localhost:8080/hello/Alice

# Test API status
curl http://localhost:8080/api/status

# Test echo endpoint
curl -X POST http://localhost:8080/api/echo \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello from client", "timestamp": "2024-01-01T00:00:00Z"}'`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Key Features Demonstrated</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Routing</h4>
            <ul className="text-sm space-y-1">
              <li>• Static routes (/hello)</li>
              <li>• Dynamic routes (/hello/&quote;{"fe"}&quote;)</li>
              <li>• Method-specific routes (GET, POST)</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Responses</h4>
            <ul className="text-sm space-y-1">
              <li>• Plain text responses</li>
              <li>• HTML responses</li>
              <li>• JSON responses</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Middleware</h4>
            <ul className="text-sm space-y-1">
              <li>• Logging middleware</li>
              <li>• Recovery middleware</li>
              <li>• Request/response processing</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Request Handling</h4>
            <ul className="text-sm space-y-1">
              <li>• Path parameters</li>
              <li>• JSON parsing</li>
              <li>• Error handling</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <p className="mb-4">After running this basic example, you can:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Add more routes and handlers</li>
          <li>Implement custom middleware</li>
          <li>Add database integration</li>
          <li>
            Explore the{" "}
            <a href="/docs/examples/rest-api" className="text-blue-600 hover:underline">
              REST API example
            </a>
          </li>
          <li>
            Learn about{" "}
            <a href="/docs/guides/middleware" className="text-blue-600 hover:underline">
              advanced middleware patterns
            </a>
          </li>
        </ul>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This basic server example demonstrates the fundamental concepts of Squirrel Framework. Its a great starting
          point for understanding how to handle different types of requests and responses. Try modifying the handlers to
          experiment with different functionality!
        </AlertDescription>
      </Alert>
    </div>
  )
}
