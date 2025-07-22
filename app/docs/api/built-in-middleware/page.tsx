import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Shield, FileText } from "lucide-react"

export default function BuiltInMiddlewarePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Built-in</Badge>
          <Badge variant="outline">Middleware</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Built-in Middleware</h1>
        <p className="text-xl text-muted-foreground">
          Ready-to-use middleware functions provided by Squirrel Framework for common use cases.
        </p>
      </div>

      <section className="space-y-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-semibold">Logger Middleware</h2>
            </div>
            <p className="text-muted-foreground">
              Logs HTTP requests with method, path, status code, and response time information.
            </p>

            <Tabs defaultValue="usage" className="w-full">
              <TabsList>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="example">Example Output</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
              </TabsList>

              <TabsContent value="usage">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import (
    "github.com/useranonymous001/squirrel"
    "github.com/useranonymous001/squirrel/middlewares"
)

func main() {
    server := SpawnServer()
    
    // Add logger middleware globally
    server.Use(middlewares.Logger)
    
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Hello, World!")
        res.Send()
    })
    
    server.Get("/api/users", func(req *Request, res *Response) {
        res.JSON([]map[string]string{
            {"id": "1", "name": "John Doe"},
            {"id": "2", "name": "Jane Smith"},
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Example console output when requests are made:

[2024-01-15 10:30:45] GET / - 200 - 2.5ms
[2024-01-15 10:30:52] GET /api/users - 200 - 5.2ms
[2024-01-15 10:31:03] POST /api/users - 201 - 12.8ms
[2024-01-15 10:31:15] GET /api/users/999 - 404 - 1.1ms
[2024-01-15 10:31:28] PUT /api/users/1 - 200 - 8.7ms

// Format: [timestamp] METHOD path - status_code - duration`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="customization">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// The Logger middleware can be customized by creating your own version:

func CustomLogger(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        start := time.Now()
        
        // Call the next handler
        next(req, res)
        
        // Log with custom format
        duration := time.Since(start)
        fmt.Printf("🚀 %s %s took %v\\n", 
            req.Method, 
            req.Path, 
            duration,
        )
    }
}

// Use custom logger instead of built-in
server.Use(CustomLogger)`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h2 className="text-2xl font-semibold">Recover Middleware</h2>
            </div>
            <p className="text-muted-foreground">
              Automatically recovers from panics and prevents the server from crashing. Enabled by default.
            </p>

            <Tabs defaultValue="default" className="w-full">
              <TabsList>
                <TabsTrigger value="default">Default Behavior</TabsTrigger>
                <TabsTrigger value="custom">Custom Recovery</TabsTrigger>
                <TabsTrigger value="disable">Disable Recovery</TabsTrigger>
              </TabsList>

              <TabsContent value="default">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Recovery middleware is enabled by default
// No additional setup required

func main() {
    server := SpawnServer()
    
    // This handler will panic, but the server won't crash
    server.Get("/panic", func(req *Request, res *Response) {
        panic("Something went wrong!")
        // This line won't be reached
        res.Write("This won't be sent")
        res.Send()
    })
    
    // Other routes continue to work normally
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Server is still running!")
        res.Send()
    })
    
    server.Listen(":8080")
}

// When /panic is accessed:
// - The panic is caught
// - A 500 Internal Server Error is returned
// - The server continues running
// - Other routes remain accessible`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import "github.com/useranonymous001/squirrel/middlewares"

func main() {
    server := SpawnServer()
    
    // Set custom recovery handler
    middlewares.SetGlobalMiddleware(func(a any, r1 *Request, r2 *Response) {
        // Log the panic
        fmt.Printf("PANIC RECOVERED: %v\\n", a)
        
        // Send custom error response
        r2.SetStatus(500)
        r2.SetHeader("Content-Type", "application/json")
        r2.JSON(map[string]interface{}{
            "error": "Internal Server Error",
            "message": "The server encountered an unexpected error",
            "timestamp": time.Now().Unix(),
            "requestId": generateRequestID(), // Your custom function
        })
        r2.Send()
    })
    
    server.Get("/panic", func(req *Request, res *Response) {
        panic("Custom panic handling!")
    })
    
    server.Listen(":8080")
}

func generateRequestID() string {
    return fmt.Sprintf("req_%d", time.Now().UnixNano())
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="disable">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`func main() {
    server := SpawnServer()
    
    // Disable automatic recovery
    server.DisableAutoRecover()
    
    // WARNING: Panics will now crash the server
    server.Get("/dangerous", func(req *Request, res *Response) {
        panic("This will crash the server!")
    })
    
    server.Listen(":8080")
}

// Note: Only disable auto-recovery if you have your own
// panic handling mechanism in place`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Using Built-in Middleware Together</h2>
            <p className="text-muted-foreground">
              Combining multiple built-in middleware functions for a complete setup.
            </p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`import (
    "github.com/useranonymous001/squirrel"
    "github.com/useranonymous001/squirrel/middlewares"
)

func main() {
    server := SpawnServer()
    
    // Add built-in middleware
    server.Use(middlewares.Logger)
    // Recovery is enabled by default
    
    // Add your custom middleware
    server.Use(func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            // Add security headers
            res.SetHeader("X-Content-Type-Options", "nosniff")
            res.SetHeader("X-Frame-Options", "DENY")
            res.SetHeader("X-XSS-Protection", "1; mode=block")
            
            next(req, res)
        }
    })
    
    // Routes
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]string{
            "message": "Server with logging and recovery",
            "timestamp": time.Now().Format(time.RFC3339),
        })
        res.Send()
    })
    
    server.Get("/test-panic", func(req *Request, res *Response) {
        // This will be caught by the recovery middleware
        panic("Test panic - server will not crash")
    })
    
    server.Listen(":8080")
}

// Expected behavior:
// 1. All requests are logged with timestamps and durations
// 2. Security headers are added to all responses
// 3. Panics are caught and handled gracefully
// 4. Server remains stable and responsive`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Middleware Best Practices</h2>
            <p className="text-muted-foreground">Recommendations for using built-in middleware effectively.</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">✅ Do</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Use Logger middleware for debugging and monitoring</li>
                  <li>• Keep the default Recovery middleware enabled in production</li>
                  <li>• Add built-in middleware early in the middleware chain</li>
                  <li>• Combine with custom middleware for specific needs</li>
                  <li>• Test panic scenarios to ensure recovery works</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">❌ Dont</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Disable recovery middleware without good reason</li>
                  <li>• Add logging middleware multiple times</li>
                  <li>• Ignore panic logs in production</li>
                  <li>• Rely solely on built-in middleware for security</li>
                  <li>• Forget to handle errors in custom recovery handlers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Built-in middleware provides essential functionality out of the box. The Recovery middleware is automatically
          enabled to prevent server crashes, while the Logger middleware helps with debugging and monitoring. You can
          customize or disable these as needed for your specific use case.
        </AlertDescription>
      </Alert>
    </div>
  )
}
