export default function MiddlewareExamplePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Middleware Example</h1>
        <p className="text-xl text-muted-foreground">
          Advanced middleware patterns including authentication, rate limiting, and custom middleware
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Complete Middleware Example</h2>
          <p className="mb-4">This example demonstrates various middleware patterns:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`package main

import (
    "context"
    "fmt"
    "log"
    "strings"
    "sync"
    "time"
    "github.com/user001/squirrel"
)

// User represents an authenticated user
type User struct {
    ID       string \`json:"id"\`
    Username string \`json:"username"\`
    Role     string \`json:"role"\`
}

// Rate limiter
type RateLimiter struct {
    requests map[string][]time.Time
    mutex    sync.Mutex
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

func (rl *RateLimiter) Allow(clientIP string) bool {
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
    
    // Check if limit exceeded
    if len(rl.requests[clientIP]) >= rl.limit {
        return false
    }
    
    // Add current request
    rl.requests[clientIP] = append(rl.requests[clientIP], now)
    return true
}

// Global rate limiter (100 requests per minute)
var rateLimiter = NewRateLimiter(100, time.Minute)

// Mock user database
var users = map[string]*User{
    "token123": {ID: "1", Username: "john", Role: "user"},
    "token456": {ID: "2", Username: "admin", Role: "admin"},
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Global middleware (applied to all routes)
    mux.Use(loggingMiddleware())
    mux.Use(recoveryMiddleware())
    mux.Use(corsMiddleware())
    mux.Use(rateLimitMiddleware())
    
    // Public routes
    mux.HandleFunc("GET /", homeHandler)
    mux.Use("GET /public", publicHandler)
    
    // Protected routes (require authentication)
    protectedMux := squirrel.NewSqurlMux()
    protectedMux.Use(authMiddleware())
    protectedMux.HandleFunc("GET /profile", profileHandler)
    protectedMux.HandleFunc("GET /dashboard", dashboardHandler)
    
    // Admin routes (require admin role)
    adminMux := squirrel.NewSqurlMux()
    adminMux.Use(authMiddleware())
    adminMux.Use(adminMiddleware())
    adminMux.HandleFunc("GET /admin/users", adminUsersHandler)
    adminMux.HandleFunc("DELETE /admin/users/{id}", adminDeleteUserHandler)
    
    // Mount sub-routers
    mux.Handle("/api/", squirrel.StripPrefix("/api", protectedMux))
    mux.Handle("/api/admin/", squirrel.StripPrefix("/api", adminMux))
    
    fmt.Println("Server with middleware starting on http://localhost:8080")
    log.Fatal(squirrel.ListenAndServe(":8080", mux))
}

// Logging middleware
func loggingMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            start := time.Now()
            
            // Add request ID
            requestID := fmt.Sprintf("%d", time.Now().UnixNano())
            w.Header().Set("X-Request-ID", requestID)
            
            // Call next handler
            next(w, r)
            
            // Log request details
            duration := time.Since(start)
            log.Printf("[%s] %s %s - %v", requestID, r.Method, r.URL.Path, duration)
        }
    }
}

// Recovery middleware
func recoveryMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            defer func() {
                if err := recover(); err != nil {
                    log.Printf("Panic recovered: %v", err)
                    w.WriteStatus(500)
                    w.JSON(map[string]string{
                        "error": "Internal server error",
                    })
                }
            }()
            
            next(w, r)
        }
    }
}

// CORS middleware
func corsMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            
            if r.Method == "OPTIONS" {
                w.WriteStatus(200)
                return
            }
            
            next(w, r)
        }
    }
}

// Rate limiting middleware
func rateLimitMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            clientIP := getClientIP(r)
            
            if !rateLimiter.Allow(clientIP) {
                w.WriteStatus(429)
                w.JSON(map[string]string{
                    "error": "Rate limit exceeded",
                    "retry_after": "60",
                })
                return
            }
            
            next(w, r)
        }
    }
}

// Authentication middleware
func authMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            authHeader := r.Header.Get("Authorization")
            if authHeader == "" {
                w.WriteStatus(401)
                w.JSON(map[string]string{
                    "error": "Authorization header required",
                })
                return
            }
            
            // Extract token (Bearer token format)
            parts := strings.Split(authHeader, " ")
            if len(parts) != 2 || parts[0] != "Bearer" {
                w.WriteStatus(401)
                w.JSON(map[string]string{
                    "error": "Invalid authorization format",
                })
                return
            }
            
            token := parts[1]
            user, exists := users[token]
            if !exists {
                w.WriteStatus(401)
                w.JSON(map[string]string{
                    "error": "Invalid token",
                })
                return
            }
            
            // Add user to request context
            ctx := context.WithValue(r.Context(), "user", user)
            r = r.WithContext(ctx)
            
            next(w, r)
        }
    }
}

// Admin middleware (requires admin role)
func adminMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            user, ok := r.Context().Value("user").(*User)
            if !ok {
                w.WriteStatus(500)
                w.JSON(map[string]string{
                    "error": "User context not found",
                })
                return
            }
            
            if user.Role != "admin" {
                w.WriteStatus(403)
                w.JSON(map[string]string{
                    "error": "Admin access required",
                })
                return
            }
            
            next(w, r)
        }
    }
}

// Timing middleware
func timingMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            start := time.Now()
            
            next(w, r)
            
            duration := time.Since(start)
            w.Header().Set("X-Response-Time", duration.String())
        }
    }
}

// Helper function to get client IP
func getClientIP(r *squirrel.Request) string {
    // Check X-Forwarded-For header
    if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
        return strings.Split(xff, ",")[0]
    }
    
    // Check X-Real-IP header
    if xri := r.Header.Get("X-Real-IP"); xri != "" {
        return xri
    }
    
    // Fall back to RemoteAddr
    return r.RemoteAddr
}

// Handler functions
func homeHandler(w *squirrel.Response, r *squirrel.Request) {
    w.JSON(map[string]string{
        "message": "Welcome to the middleware example",
        "status":  "public",
    })
}

func publicHandler(w *squirrel.Response, r *squirrel.Request) {
    w.JSON(map[string]string{
        "message": "This is a public endpoint",
        "time":    time.Now().Format(time.RFC3339),
    })
}

func profileHandler(w *squirrel.Response, r *squirrel.Request) {
    user := r.Context().Value("user").(*User)
    w.JSON(map[string]interface{}{
        "message": "User profile",
        "user":    user,
    })
}

func dashboardHandler(w *squirrel.Response, r *squirrel.Request) {
    user := r.Context().Value("user").(*User)
    w.JSON(map[string]interface{}{
        "message": "User dashboard",
        "user_id": user.ID,
        "data":    []string{"item1", "item2", "item3"},
    })
}

func adminUsersHandler(w *squirrel.Response, r *squirrel.Request) {
    var userList []*User
    for _, user := range users {
        userList = append(userList, user)
    }
    
    w.JSON(map[string]interface{}{
        "message": "Admin users list",
        "users":   userList,
    })
}

func adminDeleteUserHandler(w *squirrel.Response, r *squirrel.Request) {
    userID := r.PathValue("id")
    
    w.JSON(map[string]interface{}{
        "message": "User deleted (simulated)",
        "user_id": userID,
    })
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Testing the Middleware</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Public Endpoints</h4>
              <div className="bg-muted p-2 rounded text-sm space-y-1">
                <div>
                  <code>curl http://localhost:8080/</code>
                </div>
                <div>
                  <code>curl http://localhost:8080/public</code>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Protected Endpoints (Require Authentication)</h4>
              <div className="bg-muted p-2 rounded text-sm space-y-1">
                <div>
                  <code>curl -H &quote;Authorization: Bearer token123&quote; http://localhost:8080/api/profile</code>
                </div>
                <div>
                  <code>curl -H &quote;Authorization: Bearer token123&quote; http://localhost:8080/api/dashboard</code>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Admin Endpoints (Require Admin Role)</h4>
              <div className="bg-muted p-2 rounded text-sm space-y-1">
                <div>
                  <code>curl -H &quote;Authorization: Bearer token456&quote;  http://localhost:8080/api/admin/users</code>
                </div>
                <div>
                  <code>
                    curl -X DELETE -H &quote;Authorization: Bearer token456&quote;  http://localhost:8080/api/admin/users/1
                  </code>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Rate Limiting Test</h4>
              <div className="bg-muted p-2 rounded text-sm">
                <code>for i in {`{1..105}`}; do curl http://localhost:8080/; done</code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                After 100 requests, you will get a 429 rate limit error
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Middleware Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Security Middleware</h4>
              <ul className="text-sm space-y-1">
                <li>• Authentication with Bearer tokens</li>
                <li>• Role-based authorization</li>
                <li>• CORS handling</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Utility Middleware</h4>
              <ul className="text-sm space-y-1">
                <li>• Request logging</li>
                <li>• Panic recovery</li>
                <li>• Response timing</li>
                <li>• Request ID generation</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Advanced Patterns</h4>
              <ul className="text-sm space-y-1">
                <li>• Middleware chaining</li>
                <li>• Conditional middleware</li>
                <li>• Context passing</li>
                <li>• Sub-router mounting</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Error Handling</h4>
              <ul className="text-sm space-y-1">
                <li>• Structured error responses</li>
                <li>• HTTP status codes</li>
                <li>• Graceful degradation</li>
                <li>• Request validation</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Middleware Order</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📋 Important: Middleware Execution Order</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Recovery (catch panics first)</li>
              <li>Logging (log all requests)</li>
              <li>CORS (handle preflight requests)</li>
              <li>Rate limiting (before expensive operations)</li>
              <li>Authentication (verify user identity)</li>
              <li>Authorization (check permissions)</li>
              <li>Business logic (your handlers)</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Production Enhancements</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Use Redis for distributed rate limiting</li>
            <li>Implement JWT token validation</li>
            <li>Add request/response compression</li>
            <li>Implement circuit breaker patterns</li>
            <li>Add metrics and monitoring middleware</li>
            <li>Use structured logging (JSON format)</li>
            <li>Implement request timeout middleware</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Explore the{" "}
              <a href="/docs/examples/file-upload" className="text-blue-600 hover:underline">
                file upload example
              </a>
            </li>
            <li>
              Learn about{" "}
              <a href="/docs/guides/error-handling" className="text-blue-600 hover:underline">
                advanced error handling
              </a>
            </li>
            <li>
              Read the{" "}
              <a href="/docs/guides/middleware" className="text-blue-600 hover:underline">
                middleware guide
              </a>
            </li>
            <li>
              Check out{" "}
              <a href="/docs/api/middleware" className="text-blue-600 hover:underline">
                middleware API reference
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
