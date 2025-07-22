import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function SqurlMuxPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Core</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">SqurlMux</h1>
        <p className="text-xl text-muted-foreground">
          The main multiplexer for routing HTTP requests and managing middleware in Squirrel Framework.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type SqurlMux struct {
    // grouping together the routes
    // the server mux
    routes []route
    // global middlewares
    // also an application have more than one middleware
    middleware []Middleware
}`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Methods</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Listen()</h3>
            <p className="text-muted-foreground">Starts the server listening on the specified address.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Listen(addr string)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`func main() {
    server := SpawnServer()
    
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Server is running!")
        res.Send()
    })
    
    // Listen on different ports
    server.Listen(":8080")        // localhost:8080
    // server.Listen(":3000")     // localhost:3000
    // server.Listen("0.0.0.0:8080") // All interfaces
}

// Production example with environment variable
func main() {
    server := SpawnServer()
    
    // Setup routes...
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    fmt.Printf("Server starting on port %s\\n", port)
    server.Listen(":" + port)
}`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Use()</h3>
            <p className="text-muted-foreground">Adds global middleware to the request processing pipeline.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Use(mw Middleware)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import "github.com/useranonymous001/squirrel/middlewares"

func main() {
    server := SpawnServer()
    
    // Add built-in middleware
    server.Use(middlewares.Logger)
    
    // Add custom CORS middleware
    server.Use(func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            res.SetHeader("Access-Control-Allow-Origin", "*")
            res.SetHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
            res.SetHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
            
            if req.Method == "OPTIONS" {
                res.SetStatus(200)
                res.Send()
                return
            }
            
            next(req, res)
        }
    })
    
    // Add authentication middleware
    server.Use(func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            // Skip auth for public routes
            if req.Path == "/" || req.Path == "/health" {
                next(req, res)
                return
            }
            
            authHeader := req.Headers["Authorization"]
            if authHeader == "" {
                res.SetStatus(401)
                res.JSON(map[string]string{"error": "Authorization required"})
                res.Send()
                return
            }
            
            next(req, res)
        }
    })
    
    server.Get("/", func(req *Request, res *Response) {
        res.JSON(map[string]string{"message": "Public endpoint"})
        res.Send()
    })
    
    server.Get("/protected", func(req *Request, res *Response) {
        res.JSON(map[string]string{"message": "Protected endpoint"})
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Get()</h3>
            <p className="text-muted-foreground">
              Registers a GET route handler with optional route-specific middleware.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Get(path string, handler HandlerFunc, mws ...Middleware)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server := SpawnServer()

// Simple GET route
server.Get("/", func(req *Request, res *Response) {
    res.Write("Welcome to Squirrel Framework!")
    res.Send()
})

// GET route with URL parameters
server.Get("/users/:id", func(req *Request, res *Response) {
    userID := req.Param("id")
    res.JSON(map[string]string{
        "userId": userID,
        "message": "User details for ID: " + userID,
    })
    res.Send()
})

// GET route with query parameters
server.Get("/search", func(req *Request, res *Response) {
    queries := req.Query()
    searchTerms := req.Queries["q"]
    
    res.JSON(map[string]interface{}{
        "searchTerms": searchTerms,
        "allQueries": queries,
    })
    res.Send()
})

// GET route with route-specific middleware
cacheMiddleware := func(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        res.SetHeader("Cache-Control", "public, max-age=3600")
        next(req, res)
    }
}

server.Get("/api/data", func(req *Request, res *Response) {
    res.JSON(map[string]string{"data": "cached response"})
    res.Send()
}, cacheMiddleware)`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Post()</h3>
            <p className="text-muted-foreground">
              Registers a POST route handler with optional route-specific middleware.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Post(path string, handler HandlerFunc, mws ...Middleware)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// POST route for creating users
server.Post("/api/users", func(req *Request, res *Response) {
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Invalid request body"})
        res.Send()
        return
    }
    
    // Parse JSON body (simplified)
    if body == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Empty body"})
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

// POST route with validation middleware
validateJSON := func(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        contentType := req.Headers["Content-Type"]
        if contentType != "application/json" {
            res.SetStatus(400)
            res.JSON(map[string]string{"error": "Content-Type must be application/json"})
            res.Send()
            return
        }
        next(req, res)
    }
}

server.Post("/api/data", func(req *Request, res *Response) {
    body, _ := req.ReadBodyAsString()
    res.JSON(map[string]string{"received": body})
    res.Send()
}, validateJSON)`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Put()</h3>
            <p className="text-muted-foreground">
              Registers a PUT route handler with optional route-specific middleware.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Put(path string, handler HandlerFunc, mws ...Middleware)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// PUT route for updating users
server.Put("/api/users/:id", func(req *Request, res *Response) {
    userID := req.Param("id")
    body, err := req.ReadBodyAsString()
    
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Invalid request body"})
        res.Send()
        return
    }
    
    if userID == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "User ID required"})
        res.Send()
        return
    }
    
    res.JSON(map[string]string{
        "message": "User updated successfully",
        "userId": userID,
        "data": body,
    })
    res.Send()
})

// PUT route with authentication middleware
authMiddleware := func(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        token := req.GetCookie("auth_token")
        if token == nil {
            res.SetStatus(401)
            res.JSON(map[string]string{"error": "Authentication required"})
            res.Send()
            return
        }
        next(req, res)
    }
}

server.Put("/api/profile", func(req *Request, res *Response) {
    body, _ := req.ReadBodyAsString()
    res.JSON(map[string]string{
        "message": "Profile updated",
        "data": body,
    })
    res.Send()
}, authMiddleware)`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Delete()</h3>
            <p className="text-muted-foreground">
              Registers a DELETE route handler with optional route-specific middleware.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (s *SqurlMux) Delete(path string, handler HandlerFunc, mws ...Middleware)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// DELETE route for removing users
server.Delete("/api/users/:id", func(req *Request, res *Response) {
    userID := req.Param("id")
    
    if userID == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "User ID required"})
        res.Send()
        return
    }
    
    // Simulate user deletion
    res.SetStatus(204) // No Content
    res.Send()
})

// DELETE route with admin authorization
adminMiddleware := func(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        role := req.Headers["X-User-Role"]
        if role != "admin" {
            res.SetStatus(403)
            res.JSON(map[string]string{"error": "Admin access required"})
            res.Send()
            return
        }
        next(req, res)
    }
}

server.Delete("/api/admin/users/:id", func(req *Request, res *Response) {
    userID := req.Param("id")
    res.JSON(map[string]string{
        "message": "User deleted by admin",
        "userId": userID,
    })
    res.Send()
}, adminMiddleware)`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          SqurlMux supports middleware at both global level (using <code>Use()</code>) and route-specific level (as
          additional parameters to route methods). Route-specific middleware is executed after global middleware.
        </AlertDescription>
      </Alert>
    </div>
  )
}
