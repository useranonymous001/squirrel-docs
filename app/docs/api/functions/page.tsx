import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function FunctionsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Functions</Badge>
          <Badge variant="outline">Core</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Server Functions</h1>
        <p className="text-xl text-muted-foreground">
          Core utility functions for creating servers and handling HTTP requests in Squirrel Framework.
        </p>
      </div>

      <section className="space-y-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">SpawnServer()</h2>
            <p className="text-muted-foreground">
              Creates and returns a new SqurlMux instance for handling HTTP requests.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func SpawnServer() *SqurlMux</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`package main

import "github.com/useranonymous001/squirrel"

func main() {
    // Create a new server instance
    server := SpawnServer()
    
    // Add routes
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Hello from Squirrel!")
        res.Send()
    })
    
    server.Get("/health", func(req *Request, res *Response) {
        res.JSON(map[string]string{
            "status": "healthy",
            "server": "squirrel",
        })
        res.Send()
    })
    
    // Start the server
    server.Listen(":8080")
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Multiple server instances
func main() {
    // API server
    apiServer := SpawnServer()
    apiServer.Get("/api/users", getUsersHandler)
    apiServer.Post("/api/users", createUserHandler)
    
    // Admin server
    adminServer := SpawnServer()
    adminServer.Use(adminAuthMiddleware)
    adminServer.Get("/admin/dashboard", dashboardHandler)
    
    // Static file server
    staticServer := SpawnServer()
    staticServer.ServeStatic("/", "public")
    
    // Run servers on different ports
    go apiServer.Listen(":8080")    // API on port 8080
    go adminServer.Listen(":8081")  // Admin on port 8081
    staticServer.Listen(":8082")    // Static files on port 8082
}

// Server with configuration
func createConfiguredServer() *SqurlMux {
    server := SpawnServer()
    
    // Add global middleware
    server.Use(middlewares.Logger)
    server.Use(corsMiddleware)
    server.Use(rateLimitMiddleware)
    
    // Add common routes
    server.Get("/health", healthCheckHandler)
    server.Get("/version", versionHandler)
    
    return server
}`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">NewResponse()</h2>
            <p className="text-muted-foreground">Creates a new Response instance from a network connection.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="use-case">Use Cases</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func NewResponse(conn *net.Conn) *Response</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import (
    "net"
    "github.com/useranonymous001/squirrel"
)

// Custom server implementation using NewResponse
func customServer() {
    listener, err := net.Listen("tcp", ":8080")
    if err != nil {
        panic(err)
    }
    defer listener.Close()
    
    for {
        conn, err := listener.Accept()
        if err != nil {
            continue
        }
        
        go handleConnection(conn)
    }
}

func handleConnection(conn net.Conn) {
    defer conn.Close()
    
    // Parse the request
    req, err := ParseRequest(&conn)
    if err != nil {
        return
    }
    
    // Create response
    res := NewResponse(&conn)
    
    // Handle the request
    if req.Path == "/" {
        res.Write("Custom server response!")
        res.Send()
    } else {
        res.SetStatus(404)
        res.Write("Not Found")
        res.Send()
    }
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="use-case">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong>When to use NewResponse():</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Building custom server implementations</li>
                      <li>Creating middleware that needs direct connection access</li>
                      <li>Implementing custom protocols over HTTP</li>
                      <li>Testing and debugging HTTP responses</li>
                    </ul>
                    <p>
                      <strong>Note:</strong> Most applications should use the standard SqurlMux routing instead of
                      directly using NewResponse().
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">ParseRequest()</h2>
            <p className="text-muted-foreground">Parses an HTTP request from a network connection.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func ParseRequest(conn *net.Conn) (*Request, error)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Custom request parser with logging
func loggedParseRequest(conn *net.Conn) (*Request, error) {
    req, err := ParseRequest(conn)
    if err != nil {
        fmt.Printf("Failed to parse request: %v\\n", err)
        return nil, err
    }
    
    // Log request details
    fmt.Printf("Parsed request: %s %s\\n", req.Method, req.Path)
    fmt.Printf("Headers: %v\\n", req.Headers)
    fmt.Printf("Content-Length: %d\\n", req.ContentLength)
    
    return req, nil
}

// Custom middleware using ParseRequest
func requestInspectorMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // The request is already parsed by the framework
        // But you can access all the parsed data
        
        fmt.Printf("Method: %s\\n", req.Method)
        fmt.Printf("Path: %s\\n", req.Path)
        fmt.Printf("URL: %s\\n", req.Url.String())
        fmt.Printf("Headers: %v\\n", req.Headers)
        
        // Continue to next handler
        next(req, res)
    }
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong>What ParseRequest() does:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Reads HTTP request line (method, path, version)</li>
                      <li>Parses HTTP headers into a map</li>
                      <li>Extracts URL and query parameters</li>
                      <li>Parses cookies from Cookie header</li>
                      <li>Sets up request body for reading</li>
                      <li>Handles Content-Length and connection settings</li>
                    </ul>
                    <p>
                      <strong>Error conditions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Invalid HTTP request format</li>
                      <li>Network connection errors</li>
                      <li>Malformed headers</li>
                      <li>Invalid URL format</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Complete Server Example</h2>
            <p className="text-muted-foreground">A comprehensive example using all core functions together.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "log"
    "net"
    "time"
    "github.com/useranonymous001/squirrel"
    "github.com/useranonymous001/squirrel/middlewares"
)

func main() {
    // Create server using SpawnServer()
    server := SpawnServer()
    
    // Add middleware
    server.Use(middlewares.Logger)
    server.Use(customMiddleware)
    
    // Add routes
    setupRoutes(server)
    
    // Start server
    fmt.Println("Server starting on :8080")
    server.Listen(":8080")
}

func setupRoutes(server *SqurlMux) {
    // Home route
    server.Get("/", homeHandler)
    
    // API routes
    server.Get("/api/status", statusHandler)
    server.Post("/api/echo", echoHandler)
    server.Get("/api/users/:id", getUserHandler)
    
    // Static files
    server.ServeStatic("/static", "public")
    
    // Custom protocol endpoint
    server.Get("/custom", customProtocolHandler)
}

func homeHandler(req *Request, res *Response) {
    html := \`<!DOCTYPE html>
<html>
<head><title>Squirrel Server</title></head>
<body>
    <h1>Welcome to Squirrel Framework!</h1>
    <p>Server is running successfully.</p>
    <ul>
        <li><a href="/api/status">Server Status</a></li>
        <li><a href="/api/users/123">User Example</a></li>
        <li><a href="/static/index.html">Static Files</a></li>
    </ul>
</body>
</html>\`
    
    res.SetHeader("Content-Type", "text/html")
    res.Write(html)
    res.Send()
}

func statusHandler(req *Request, res *Response) {
    status := map[string]interface{}{
        "server": "Squirrel Framework",
        "version": "1.0.0",
        "timestamp": time.Now().Unix(),
        "uptime": "24h",
        "status": "healthy",
    }
    
    res.JSON(status)
    res.Send()
}

func echoHandler(req *Request, res *Response) {
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Failed to read body"})
        res.Send()
        return
    }
    
    response := map[string]interface{}{
        "method": req.Method,
        "path": req.Path,
        "headers": req.Headers,
        "body": body,
        "timestamp": time.Now().Format(time.RFC3339),
    }
    
    res.JSON(response)
    res.Send()
}

func getUserHandler(req *Request, res *Response) {
    userID := req.Param("id")
    
    user := map[string]interface{}{
        "id": userID,
        "name": "John Doe",
        "email": "john@example.com",
        "created": time.Now().AddDate(-1, 0, 0).Format(time.RFC3339),
    }
    
    res.JSON(user)
    res.Send()
}

func customProtocolHandler(req *Request, res *Response) {
    // Example of using lower-level functions
    // This demonstrates direct connection access
    
    res.SetHeader("X-Custom-Protocol", "Squirrel-1.0")
    res.SetStatus(200)
    res.JSON(map[string]string{
        "message": "Custom protocol response",
        "connection": "direct",
    })
    res.Send()
}

func customMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        start := time.Now()
        
        // Add custom headers
        res.SetHeader("X-Powered-By", "Squirrel Framework")
        res.SetHeader("X-Request-ID", fmt.Sprintf("req_%d", start.UnixNano()))
        
        // Call next handler
        next(req, res)
        
        // Log completion
        duration := time.Since(start)
        fmt.Printf("Request completed in %v\\n", duration)
    }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These core functions provide the foundation for Squirrel Framework. <code>SpawnServer()</code> is the main
          entry point for most applications, while <code>NewResponse()</code> and <code>ParseRequest()</code> are used
          internally by the framework and for advanced custom implementations.
        </AlertDescription>
      </Alert>
    </div>
  )
}
