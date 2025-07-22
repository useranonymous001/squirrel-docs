import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Code, Zap, AlertTriangle } from "lucide-react"

export default function RoutingGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Routing Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn how to define routes, handle path parameters, and organize your applications URL structure with
          Squirrel.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <Globe className="w-3 h-3 mr-1" />
            Routing
          </Badge>
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            HTTP Methods
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Path Parameters
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Routing</CardTitle>
          <CardDescription>Define simple routes to handle different URL paths</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="example" className="w-full">
            <TabsList>
              <TabsTrigger value="example">Example</TabsTrigger>
              <TabsTrigger value="explanation">Explanation</TabsTrigger>
            </TabsList>
            <TabsContent value="example">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "github.com/squirrel-land/squirrel"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Basic routes
    mux.HandleFunc("/", homeHandler)
    mux.HandleFunc("/about", aboutHandler)
    mux.HandleFunc("/contact", contactHandler)
    
    http.ListenAndServe(":8080", mux)
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to the home page!")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "About us page")
}

func contactHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Contact us at contact@example.com")
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="explanation">
              <div className="space-y-4">
                <p>
                  Routes in Squirrel are defined using the <code>HandleFunc</code> method. Each route consists of:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    <strong>Path pattern:</strong> The URL pattern to match (e.g., &quote;/&quote;, &quote;/about&quote;)
                  </li>
                  <li>
                    <strong>Handler function:</strong> The function to execute when the route is matched
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Handler functions must have the signature <code>func(http.ResponseWriter, *http.Request)</code>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Path Parameters</CardTitle>
          <CardDescription>Capture dynamic values from URL paths</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="example" className="w-full">
            <TabsList>
              <TabsTrigger value="example">Example</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
            </TabsList>
            <TabsContent value="example">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "github.com/squirrel-land/squirrel"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Single parameter
    mux.HandleFunc("/user/{id}", userHandler)
    
    // Multiple parameters
    mux.HandleFunc("/user/{id}/post/{postId}", postHandler)
    
    // Optional parameters with wildcards
    mux.HandleFunc("/files/{path...}", fileHandler)
    
    http.ListenAndServe(":8080", mux)
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    id := squirrel.GetParam(r, "id")
    fmt.Fprintf(w, "User ID: %s", id)
}

func postHandler(w http.ResponseWriter, r *http.Request) {
    userID := squirrel.GetParam(r, "id")
    postID := squirrel.GetParam(r, "postId")
    fmt.Fprintf(w, "User %s, Post %s", userID, postID)
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
    path := squirrel.GetParam(r, "path")
    fmt.Fprintf(w, "File path: %s", path)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="patterns">
              <div className="space-y-4">
                <h4 className="font-semibold">Parameter Patterns:</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded">
                    <code className="font-mono text-sm">{`{id}`}</code>
                    <p className="text-sm text-muted-foreground mt-1">Matches a single path segment</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <code className="font-mono text-sm">{`{path...}`}</code>
                    <p className="text-sm text-muted-foreground mt-1">Matches multiple path segments (wildcard)</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded">
                    <code className="font-mono text-sm">{`/api/v{version}/users/{id}`}</code>
                    <p className="text-sm text-muted-foreground mt-1">Multiple parameters in a single route</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>HTTP Methods</CardTitle>
          <CardDescription>Handle different HTTP methods (GET, POST, PUT, DELETE, etc.)</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "github.com/squirrel-land/squirrel"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Method-specific routes
    mux.Get("/users", getUsersHandler)
    mux.Post("/users", createUserHandler)
    mux.Put("/users/{id}", updateUserHandler)
    mux.Delete("/users/{id}", deleteUserHandler)
    
    // Generic handler with method checking
    mux.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            fmt.Fprintf(w, "Status: OK")
        case http.MethodPost:
            fmt.Fprintf(w, "Status updated")
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })
    
    http.ListenAndServe(":8080", mux)
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    users := []string{"Alice", "Bob", "Charlie"}
    json.NewEncoder(w).Encode(users)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
    // Handle user creation
    w.WriteHeader(http.StatusCreated)
    fmt.Fprintf(w, "User created")
}

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
    id := squirrel.GetParam(r, "id")
    fmt.Fprintf(w, "User %s updated", id)
}

func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
    id := squirrel.GetParam(r, "id")
    fmt.Fprintf(w, "User %s deleted", id)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Groups</CardTitle>
          <CardDescription>Organize related routes with common prefixes and middleware</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "fmt"
    "net/http"
    "github.com/squirrel-land/squirrel"
)

func main() {
    mux := squirrel.NewSqurlMux()
    
    // API v1 routes
    apiV1 := mux.Group("/api/v1")
    apiV1.Use(authMiddleware) // Apply middleware to all routes in group
    apiV1.Get("/users", getUsersHandler)
    apiV1.Post("/users", createUserHandler)
    apiV1.Get("/posts", getPostsHandler)
    
    // API v2 routes
    apiV2 := mux.Group("/api/v2")
    apiV2.Use(authMiddleware)
    apiV2.Use(rateLimitMiddleware)
    apiV2.Get("/users", getUsersV2Handler)
    apiV2.Post("/users", createUserV2Handler)
    
    // Admin routes
    admin := mux.Group("/admin")
    admin.Use(adminAuthMiddleware)
    admin.Get("/dashboard", adminDashboardHandler)
    admin.Get("/users", adminUsersHandler)
    
    http.ListenAndServe(":8080", mux)
}

func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Check authentication
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        next.ServeHTTP(w, r)
    })
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Best Practice:</strong> Use route groups to organize your API endpoints and apply common middleware.
          This keeps your code clean and makes it easier to manage authentication, rate limiting, and other
          cross-cutting concerns.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Routing Patterns</CardTitle>
          <CardDescription>Complex routing scenarios and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subdomain" className="w-full">
            <TabsList>
              <TabsTrigger value="subdomain">Subdomain Routing</TabsTrigger>
              <TabsTrigger value="regex">Regex Constraints</TabsTrigger>
              <TabsTrigger value="fallback">Fallback Routes</TabsTrigger>
            </TabsList>
            <TabsContent value="subdomain">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Subdomain routing
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    host := r.Host
    switch {
    case strings.HasPrefix(host, "api."):
        apiHandler(w, r)
    case strings.HasPrefix(host, "admin."):
        adminHandler(w, r)
    default:
        mainSiteHandler(w, r)
    }
})`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="regex">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Regex constraints for parameters
mux.HandleFunc("/user/{id:[0-9]+}", userByIDHandler)
mux.HandleFunc("/post/{slug:[a-z-]+}", postBySlugHandler)
mux.HandleFunc("/file/{name:.+\\.(jpg|png|gif)}", imageHandler)`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="fallback">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Fallback routes (catch-all)
mux.HandleFunc("/api/", apiNotFoundHandler)
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/" {
        http.NotFound(w, r)
        return
    }
    homeHandler(w, r)
})`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
