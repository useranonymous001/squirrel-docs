import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function MiddlewarePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Function</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Middleware</h1>
        <p className="text-xl text-muted-foreground">
          Function signature for middleware that wraps handlers to provide cross-cutting functionality.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type Middleware func(HandlerFunc) HandlerFunc`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Creating Custom Middleware</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Middleware Pattern</h3>
            <p className="text-muted-foreground">The fundamental structure of middleware in Squirrel Framework.</p>

            <Tabs defaultValue="example" className="w-full">
              <TabsList>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Basic middleware template
func myMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // Code to run BEFORE the handler
        fmt.Println("Before handler execution")
        
        // Call the next handler in the chain
        next(req, res)
        
        // Code to run AFTER the handler
        fmt.Println("After handler execution")
    }
}

func main() {
    server := SpawnServer()
    
    // Apply middleware globally
    server.Use(myMiddleware)
    
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Hello, World!")
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="explanation">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong>Middleware Structure:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Takes a <code>HandlerFunc</code> as parameter (the next handler)
                      </li>
                      <li>
                        Returns a new <code>HandlerFunc</code> that wraps the original
                      </li>
                      <li>
                        Can execute code before and after calling <code>next(req, res)</code>
                      </li>
                      <li>Can modify request/response or terminate the chain early</li>
                    </ul>
                    <p>
                      <strong>Execution Order:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Global middleware runs first (in order of registration)</li>
                      <li>Route-specific middleware runs after global middleware</li>
                      <li>The actual handler runs last</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Logging Middleware</h3>
            <p className="text-muted-foreground">Middleware that logs request details and response times.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`import (
    "fmt"
    "time"
)

func LoggingMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        start := time.Now()
        
        // Log request start
        fmt.Printf("[%s] %s %s - Started\\n", 
            start.Format("2006-01-02 15:04:05"),
            req.Method, 
            req.Path,
        )
        
        // Call next handler
        next(req, res)
        
        // Log request completion
        duration := time.Since(start)
        fmt.Printf("[%s] %s %s - Completed in %v\\n",
            time.Now().Format("2006-01-02 15:04:05"),
            req.Method,
            req.Path,
            duration,
        )
    }
}

// Usage
server.Use(LoggingMiddleware)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Authentication Middleware</h3>
            <p className="text-muted-foreground">Middleware that validates authentication tokens.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func AuthMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // Check for Authorization header
        authHeader := req.Headers["Authorization"]
        if authHeader == "" {
            res.SetStatus(401)
            res.JSON(map[string]string{
                "error": "Authorization header required",
            })
            res.Send()
            return // Stop the chain here
        }
        
        // Validate token (simplified)
        if !strings.HasPrefix(authHeader, "Bearer ") {
            res.SetStatus(401)
            res.JSON(map[string]string{
                "error": "Invalid authorization format",
            })
            res.Send()
            return
        }
        
        token := strings.TrimPrefix(authHeader, "Bearer ")
        if token != "valid-token-123" {
            res.SetStatus(401)
            res.JSON(map[string]string{
                "error": "Invalid token",
            })
            res.Send()
            return
        }
        
        // Token is valid, continue to next handler
        next(req, res)
    }
}

// Apply to specific routes
server.Get("/protected", protectedHandler, AuthMiddleware)

// Or apply globally
server.Use(AuthMiddleware)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">CORS Middleware</h3>
            <p className="text-muted-foreground">Middleware that handles Cross-Origin Resource Sharing.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func CORSMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // Set CORS headers
        res.SetHeader("Access-Control-Allow-Origin", "*")
        res.SetHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.SetHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        res.SetHeader("Access-Control-Max-Age", "86400") // 24 hours
        
        // Handle preflight OPTIONS request
        if req.Method == "OPTIONS" {
            res.SetStatus(200)
            res.Send()
            return
        }
        
        // Continue to next handler
        next(req, res)
    }
}

// Usage
server.Use(CORSMiddleware)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Rate Limiting Middleware</h3>
            <p className="text-muted-foreground">Middleware that implements basic rate limiting.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`import (
    "sync"
    "time"
)

type RateLimiter struct {
    requests map[string][]time.Time
    mutex    sync.RWMutex
    limit    int
    window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
    return &RateLimiter{
        requests: make(map[string][]time.Time),
        limit:    limit,
        window:   window,
    }
}

func (rl *RateLimiter) Middleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // Use IP address as identifier (simplified)
        clientIP := req.Headers["X-Forwarded-For"]
        if clientIP == "" {
            clientIP = "unknown"
        }
        
        rl.mutex.Lock()
        defer rl.mutex.Unlock()
        
        now := time.Now()
        
        // Clean old requests
        if requests, exists := rl.requests[clientIP]; exists {
            var validRequests []time.Time
            for _, reqTime := range requests {
                if now.Sub(reqTime) < rl.window {
                    validRequests = append(validRequests, reqTime)
                }
            }
            rl.requests[clientIP] = validRequests
        }
        
        // Check rate limit
        if len(rl.requests[clientIP]) >= rl.limit {
            res.SetStatus(429) // Too Many Requests
            res.SetHeader("Retry-After", "60")
            res.JSON(map[string]string{
                "error": "Rate limit exceeded",
            })
            res.Send()
            return
        }
        
        // Add current request
        rl.requests[clientIP] = append(rl.requests[clientIP], now)
        
        // Continue to next handler
        next(req, res)
    }
}

// Usage
rateLimiter := NewRateLimiter(100, time.Minute) // 100 requests per minute
server.Use(rateLimiter.Middleware)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Request Validation Middleware</h3>
            <p className="text-muted-foreground">Middleware that validates request content and format.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func ValidateJSONMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        // Only validate POST and PUT requests
        if req.Method != "POST" && req.Method != "PUT" {
            next(req, res)
            return
        }
        
        // Check Content-Type
        contentType := req.Headers["Content-Type"]
        if contentType != "application/json" {
            res.SetStatus(415) // Unsupported Media Type
            res.JSON(map[string]string{
                "error": "Content-Type must be application/json",
            })
            res.Send()
            return
        }
        
        // Check Content-Length
        if req.ContentLength == 0 {
            res.SetStatus(400)
            res.JSON(map[string]string{
                "error": "Request body cannot be empty",
            })
            res.Send()
            return
        }
        
        // Validate JSON format
        body, err := req.ReadBodyAsString()
        if err != nil {
            res.SetStatus(400)
            res.JSON(map[string]string{
                "error": "Failed to read request body",
            })
            res.Send()
            return
        }
        
        var jsonData interface{}
        if err := json.Unmarshal([]byte(body), &jsonData); err != nil {
            res.SetStatus(400)
            res.JSON(map[string]string{
                "error": "Invalid JSON format",
                "details": err.Error(),
            })
            res.Send()
            return
        }
        
        // JSON is valid, continue
        next(req, res)
    }
}

// Usage for specific routes
server.Post("/api/data", dataHandler, ValidateJSONMiddleware)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Middleware Chaining</h3>
            <p className="text-muted-foreground">How to combine multiple middleware functions.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func main() {
    server := SpawnServer()
    
    // Global middleware (applied to all routes)
    server.Use(LoggingMiddleware)
    server.Use(CORSMiddleware)
    
    // Public routes
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]string{"message": "Public endpoint"})
        res.Send()
    })
    
    // Protected routes with multiple middleware
    server.Get("/api/protected", 
        protectedHandler, 
        AuthMiddleware,           // Route-specific auth
        rateLimiter.Middleware,  // Route-specific rate limiting
    )
    
    // API routes with validation
    server.Post("/api/users", 
        createUserHandler,
        AuthMiddleware,
        ValidateJSONMiddleware,
    )
    
    server.Listen(":8080")
}

// Middleware execution order:
// 1. LoggingMiddleware (global)
// 2. CORSMiddleware (global)
// 3. AuthMiddleware (route-specific)
// 4. ValidateJSONMiddleware (route-specific)
// 5. createUserHandler (actual handler)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Middleware functions are executed in the order they are registered. Global middleware (added with{" "}
          <code>Use()</code>) runs before route-specific middleware. Always call <code>next(req, res)</code> to continue
          the chain, or omit it to terminate early.
        </AlertDescription>
      </Alert>
    </div>
  )
}
