import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Code, Zap, AlertTriangle, CheckCircle } from "lucide-react"

export default function MiddlewareGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Middleware Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn how to use middleware for cross-cutting concerns like authentication, logging, CORS, and more in your
          Squirrel applications.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <Shield className="w-3 h-3 mr-1" />
            Authentication
          </Badge>
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            Logging
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            CORS
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is Middleware?</CardTitle>
          <CardDescription>Understanding the middleware pattern in web applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Middleware is a function that sits between the incoming request and the outgoing response. It can modify
              the request, response, or both, and decide whether to pass control to the next middleware in the chain.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Middleware Flow:</h4>
              <div className="text-sm space-y-1">
                <div>Request → Middleware 1 → Middleware 2 → Handler → Response</div>
                <div className="text-muted-foreground">
                  Each middleware can modify the request/response or stop the chain
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creating Custom Middleware</CardTitle>
          <CardDescription>Build your own middleware functions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Middleware</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Example</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "log"
    "net/http"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        // Call the next handler
        next.ServeHTTP(w, r)
        
        // Log after the request is processed
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Authentication middleware
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // Validate token (simplified)
        if token != "Bearer valid-token" {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        // Token is valid, continue to next handler
        next.ServeHTTP(w, r)
    })
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Apply middleware globally
    mux.Use(loggingMiddleware)
    
    // Public routes
    mux.HandleFunc("/", homeHandler)
    mux.HandleFunc("/login", loginHandler)
    
    // Protected routes
    protected := mux.Group("/api")
    protected.Use(authMiddleware)
    protected.Get("/profile", profileHandler)
    protected.Get("/data", dataHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="advanced">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Advanced middleware with configuration
type RateLimiter struct {
    requests map[string][]time.Time
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

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ip := r.RemoteAddr
        now := time.Now()
        
        // Clean old requests
        if requests, exists := rl.requests[ip]; exists {
            var validRequests []time.Time
            for _, reqTime := range requests {
                if now.Sub(reqTime) < rl.window {
                    validRequests = append(validRequests, reqTime)
                }
            }
            rl.requests[ip] = validRequests
        }
        
        // Check rate limit
        if len(rl.requests[ip]) >= rl.limit {
            http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
            return
        }
        
        // Add current request
        rl.requests[ip] = append(rl.requests[ip], now)
        
        next.ServeHTTP(w, r)
    })
}

// Usage
func main() {
    mux := squirrel.NewSqurlMux()
    
    // Rate limiting: 10 requests per minute
    rateLimiter := NewRateLimiter(10, time.Minute)
    mux.Use(rateLimiter.Middleware)
    
    mux.HandleFunc("/api/data", dataHandler)
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Built-in Middleware</CardTitle>
          <CardDescription>Use Squirrels built-in middleware for common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cors" className="w-full">
            <TabsList>
              <TabsTrigger value="cors">CORS</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
              <TabsTrigger value="compression">Compression</TabsTrigger>
            </TabsList>
            <TabsContent value="cors">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "net/http"
    "github.com/squirrel-land/squirrel"
    "github.com/squirrel-land/squirrel/middleware"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // CORS middleware with configuration
    corsConfig := middleware.CORSConfig{
        AllowOrigins:     []string{"https://example.com", "https://app.example.com"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
        MaxAge:           3600,
    }
    
    mux.Use(middleware.CORS(corsConfig))
    
    // Your routes
    mux.Get("/api/users", getUsersHandler)
    mux.Post("/api/users", createUserHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="recovery">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "net/http"
    "github.com/squirrel-land/squirrel"
    "github.com/squirrel-land/squirrel/middleware"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Recovery middleware to handle panics
    mux.Use(middleware.Recovery())
    
    // This handler will panic, but recovery middleware will catch it
    mux.HandleFunc("/panic", func(w http.ResponseWriter, r *http.Request) {
        panic("Something went wrong!")
    })
    
    // Normal handler
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, World!"))
    })
    
    http.ListenAndServe(":8080", mux)
}

// Custom recovery with logging
func customRecovery() squirrel.Middleware {
    return middleware.RecoveryWithConfig(middleware.RecoveryConfig{
        LogFunc: func(err interface{}) {
            log.Printf("Panic recovered: %v", err)
        },
        ResponseFunc: func(w http.ResponseWriter, r *http.Request, err interface{}) {
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        },
    })
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="compression">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "net/http"
    "github.com/squirrel-land/squirrel"
    "github.com/squirrel-land/squirrel/middleware"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Gzip compression middleware
    mux.Use(middleware.Gzip())
    
    // Or with custom configuration
    gzipConfig := middleware.GzipConfig{
        Level: 6, // Compression level (1-9)
        MinLength: 1024, // Only compress responses larger than 1KB
    }
    mux.Use(middleware.GzipWithConfig(gzipConfig))
    
    mux.HandleFunc("/large-response", func(w http.ResponseWriter, r *http.Request) {
        // This response will be compressed
        largeData := make([]byte, 10000)
        w.Write(largeData)
    })
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Middleware Chain Order</CardTitle>
          <CardDescription>Understanding the order of middleware execution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Middleware order matters! Middleware is executed in the order its added.
              </AlertDescription>
            </Alert>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`func main() {
    mux := squirrel.NewSqurlMux()
    
    // Middleware execution order:
    mux.Use(middleware.Recovery())      // 1. Catch panics first
    mux.Use(middleware.Logger())        // 2. Log all requests
    mux.Use(middleware.CORS())          // 3. Handle CORS
    mux.Use(middleware.RateLimit())     // 4. Rate limiting
    mux.Use(middleware.Auth())          // 5. Authentication last
    
    // Request flow:
    // Request → Recovery → Logger → CORS → RateLimit → Auth → Handler
    // Response ← Recovery ← Logger ← CORS ← RateLimit ← Auth ← Handler
    
    mux.HandleFunc("/api/data", dataHandler)
    http.ListenAndServe(":8080", mux)
}`}</code>
            </pre>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recommended Order:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Recovery (catch panics)</li>
                <li>Logging (log all requests)</li>
                <li>CORS (handle preflight requests)</li>
                <li>Compression (compress responses)</li>
                <li>Rate limiting (prevent abuse)</li>
                <li>Authentication (verify users)</li>
                <li>Authorization (check permissions)</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conditional Middleware</CardTitle>
          <CardDescription>Apply middleware conditionally based on routes or conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "net/http"
    "strings"
    "github.com/squirrel-land/squirrel"
)

// Conditional middleware wrapper
func conditionalMiddleware(condition func(*http.Request) bool, middleware squirrel.Middleware) squirrel.Middleware {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            if condition(r) {
                middleware(next).ServeHTTP(w, r)
            } else {
                next.ServeHTTP(w, r)
            }
        })
    }
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Apply auth middleware only to API routes
    apiOnlyAuth := conditionalMiddleware(
        func(r *http.Request) bool {
            return strings.HasPrefix(r.URL.Path, "/api/")
        },
        authMiddleware,
    )
    
    mux.Use(apiOnlyAuth)
    
    // Public routes (no auth required)
    mux.HandleFunc("/", homeHandler)
    mux.HandleFunc("/about", aboutHandler)
    
    // API routes (auth required)
    mux.HandleFunc("/api/users", usersHandler)
    mux.HandleFunc("/api/posts", postsHandler)
    
    http.ListenAndServe(":8080", mux)
}

// Skip middleware for specific paths
func skipPaths(paths []string, middleware squirrel.Middleware) squirrel.Middleware {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            for _, path := range paths {
                if r.URL.Path == path {
                    next.ServeHTTP(w, r)
                    return
                }
            }
            middleware(next).ServeHTTP(w, r)
        })
    }
}

// Usage: Skip auth for login and register endpoints
// mux.Use(skipPaths([]string{"/login", "/register"}, authMiddleware))`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>Tips for effective middleware usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Keep middleware focused</h4>
                <p className="text-sm text-muted-foreground">
                  Each middleware should have a single responsibility (logging, auth, etc.)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Handle errors gracefully</h4>
                <p className="text-sm text-muted-foreground">
                  Always provide meaningful error responses and dont let panics crash your server
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Use context for request-scoped data</h4>
                <p className="text-sm text-muted-foreground">
                  Store user information, request IDs, etc. in the request context
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Test middleware independently</h4>
                <p className="text-sm text-muted-foreground">
                  Write unit tests for your middleware functions to ensure they work correctly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
