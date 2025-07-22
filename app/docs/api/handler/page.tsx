import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function HandlerPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Function</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">HandlerFunc</h1>
        <p className="text-xl text-muted-foreground">
          Function signature for request handlers that process HTTP requests and generate responses.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type HandlerFunc func(req *Request, res *Response)`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Handler</h3>
            <p className="text-muted-foreground">Simple handler that responds with plain text.</p>

            <Tabs defaultValue="example" className="w-full">
              <TabsList>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Define a handler function
func helloHandler(req *Request, res *Response) {
    res.Write("Hello, World!")
    res.Send()
}

func main() {
    server := SpawnServer()
    
    // Use the handler function
    server.Get("/hello", helloHandler)
    
    // Or use an anonymous function
    server.Get("/", func(req *Request, res *Response) {
        res.Write("Welcome to Squirrel!")
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
                      <strong>Parameters:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        <code>req *Request</code> - Contains all request data (headers, body, params, etc.)
                      </li>
                      <li>
                        <code>res *Response</code> - Used to build and send the HTTP response
                      </li>
                    </ul>
                    <p>
                      <strong>Key Points:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Always call <code>res.Send()</code> to complete the response
                      </li>
                      <li>Handle errors appropriately with proper status codes</li>
                      <li>
                        Use <code>return</code> statements to exit early when needed
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">JSON API Handler</h3>
            <p className="text-muted-foreground">Handler that processes JSON data and returns JSON responses.</p>

            <Tabs defaultValue="example" className="w-full">
              <TabsList>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func createUserHandler(req *Request, res *Response) {
    // Read request body
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Invalid request body"})
        res.Send()
        return
    }
    
    // Parse JSON (simplified - you'd use json.Unmarshal in real code)
    if body == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Empty request body"})
        res.Send()
        return
    }
    
    // Create user (simulated)
    user := User{
        ID:    123,
        Name:  "John Doe",
        Email: "john@example.com",
    }
    
    res.SetStatus(201)
    res.JSON(user)
    res.Send()
}

func main() {
    server := SpawnServer()
    server.Post("/api/users", createUserHandler)
    server.Listen(":8080")
}`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import (
    "encoding/json"
    "fmt"
)

func advancedUserHandler(req *Request, res *Response) {
    // Check content type
    contentType := req.Headers["Content-Type"]
    if contentType != "application/json" {
        res.SetStatus(415) // Unsupported Media Type
        res.JSON(map[string]string{
            "error": "Content-Type must be application/json",
        })
        res.Send()
        return
    }
    
    // Read and parse JSON
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Failed to read body"})
        res.Send()
        return
    }
    
    var user User
    if err := json.Unmarshal([]byte(body), &user); err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{
            "error": "Invalid JSON format",
            "details": err.Error(),
        })
        res.Send()
        return
    }
    
    // Validate user data
    if user.Name == "" || user.Email == "" {
        res.SetStatus(422) // Unprocessable Entity
        res.JSON(map[string]string{
            "error": "Name and email are required",
        })
        res.Send()
        return
    }
    
    // Set response headers
    res.SetHeader("Location", fmt.Sprintf("/api/users/%d", user.ID))
    res.SetStatus(201)
    res.JSON(map[string]interface{}{
        "message": "User created successfully",
        "user": user,
    })
    res.Send()
}`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Handler with URL Parameters</h3>
            <p className="text-muted-foreground">Handler that extracts and uses URL parameters.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func getUserHandler(req *Request, res *Response) {
    userID := req.Param("id")
    
    if userID == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "User ID is required"})
        res.Send()
        return
    }
    
    // Simulate user lookup
    if userID == "404" {
        res.SetStatus(404)
        res.JSON(map[string]string{"error": "User not found"})
        res.Send()
        return
    }
    
    user := User{
        ID:    123,
        Name:  "John Doe",
        Email: "john@example.com",
    }
    
    res.JSON(user)
    res.Send()
}

func main() {
    server := SpawnServer()
    
    // Route with parameter
    server.Get("/api/users/:id", getUserHandler)
    
    // Multiple parameters
    server.Get("/api/users/:userId/posts/:postId", func(req *Request, res *Response) {
        userID := req.Param("userId")
        postID := req.Param("postId")
        
        res.JSON(map[string]string{
            "userId": userID,
            "postId": postID,
            "message": fmt.Sprintf("Post %s by user %s", postID, userID),
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Handler with Query Parameters</h3>
            <p className="text-muted-foreground">Handler that processes query string parameters.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func searchHandler(req *Request, res *Response) {
    // Get all query parameters
    queries := req.Query()
    
    // Get specific query parameters
    searchTerms := req.Queries["q"]        // []string
    categories := req.Queries["category"]  // []string
    limitStr := req.Queries["limit"]       // []string
    
    // Process search terms
    if len(searchTerms) == 0 {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Search query 'q' is required"})
        res.Send()
        return
    }
    
    // Parse limit (default to 10)
    limit := 10
    if len(limitStr) > 0 {
        if parsedLimit, err := strconv.Atoi(limitStr[0]); err == nil {
            limit = parsedLimit
        }
    }
    
    // Build response
    response := map[string]interface{}{
        "searchTerms": searchTerms,
        "categories":  categories,
        "limit":       limit,
        "results":     []string{"result1", "result2", "result3"},
    }
    
    res.JSON(response)
    res.Send()
}

// Usage: GET /search?q=golang&q=web&category=framework&limit=5`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Error Handling Pattern</h3>
            <p className="text-muted-foreground">Best practices for error handling in handlers.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func robustHandler(req *Request, res *Response) {
    // Defer recovery for unexpected panics
    defer func() {
        if r := recover(); r != nil {
            res.SetStatus(500)
            res.JSON(map[string]string{
                "error": "Internal server error",
                "message": "An unexpected error occurred",
            })
            res.Send()
        }
    }()
    
    // Validate request method (if needed)
    if req.Method != "POST" {
        res.SetStatus(405) // Method Not Allowed
        res.SetHeader("Allow", "POST")
        res.JSON(map[string]string{"error": "Method not allowed"})
        res.Send()
        return
    }
    
    // Check content length
    if req.ContentLength > 1024*1024 { // 1MB limit
        res.SetStatus(413) // Payload Too Large
        res.JSON(map[string]string{"error": "Request body too large"})
        res.Send()
        return
    }
    
    // Process request
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{
            "error": "Failed to read request body",
            "details": err.Error(),
        })
        res.Send()
        return
    }
    
    // Success response
    res.SetStatus(200)
    res.JSON(map[string]string{
        "message": "Request processed successfully",
        "data": body,
    })
    res.Send()
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          HandlerFunc is the core interface for processing requests in Squirrel Framework. Always ensure you call{" "}
          <code>res.Send()</code> and handle errors appropriately with proper HTTP status codes.
        </AlertDescription>
      </Alert>
    </div>
  )
}
