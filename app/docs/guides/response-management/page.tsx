import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Code, Zap, CheckCircle } from "lucide-react"

export default function ResponseManagementGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Response Management Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn how to send different types of responses, set headers, handle content negotiation, and manage status
          codes in Squirrel.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <FileText className="w-3 h-3 mr-1" />
            JSON
          </Badge>
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            Templates
          </Badge>
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Status Codes
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSON Responses</CardTitle>
          <CardDescription>Send structured JSON data with proper headers and status codes</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "net/http"
    "time"
    "github.com/squirrel-land/squirrel"
)

type User struct {
    ID        int       \`json:"id"\`
    Name      string    \`json:"name"\`
    Email     string    \`json:"email"\`
    CreatedAt time.Time \`json:"created_at"\`
}

type APIResponse struct {
    Success bool        \`json:"success"\`
    Data    interface{} \`json:"data,omitempty"\`
    Error   string      \`json:"error,omitempty"\`
    Meta    *Meta       \`json:"meta,omitempty"\`
}

type Meta struct {
    Page       int \`json:"page"\`
    PerPage    int \`json:"per_page"\`
    Total      int \`json:"total"\`
    TotalPages int \`json:"total_pages"\`
}

// Helper function to send JSON responses
func sendJSON(w http.ResponseWriter, data interface{}, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    
    if err := json.NewEncoder(w).Encode(data); err != nil {
        http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
    }
}

// Success response helper
func sendSuccess(w http.ResponseWriter, data interface{}) {
    response := APIResponse{
        Success: true,
        Data:    data,
    }
    sendJSON(w, response, http.StatusOK)
}

// Error response helper
func sendError(w http.ResponseWriter, message string, statusCode int) {
    response := APIResponse{
        Success: false,
        Error:   message,
    }
    sendJSON(w, response, statusCode)
}

// Paginated response helper
func sendPaginated(w http.ResponseWriter, data interface{}, page, perPage, total int) {
    totalPages := (total + perPage - 1) / perPage
    
    response := APIResponse{
        Success: true,
        Data:    data,
        Meta: &Meta{
            Page:       page,
            PerPage:    perPage,
            Total:      total,
            TotalPages: totalPages,
        },
    }
    sendJSON(w, response, http.StatusOK)
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    users := []User{
        {ID: 1, Name: "Alice", Email: "alice@example.com", CreatedAt: time.Now()},
        {ID: 2, Name: "Bob", Email: "bob@example.com", CreatedAt: time.Now()},
    }
    
    sendPaginated(w, users, 1, 10, len(users))
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    id := squirrel.GetParam(r, "id")
    
    // Simulate user lookup
    if id == "999" {
        sendError(w, "User not found", http.StatusNotFound)
        return
    }
    
    user := User{
        ID:        1,
        Name:      "Alice",
        Email:     "alice@example.com",
        CreatedAt: time.Now(),
    }
    
    sendSuccess(w, user)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        sendError(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    // Simulate user creation
    user.ID = 123
    user.CreatedAt = time.Now()
    
    // Return 201 Created for successful creation
    response := APIResponse{
        Success: true,
        Data:    user,
    }
    sendJSON(w, response, http.StatusCreated)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/users", getUsersHandler)
    mux.Get("/users/{id}", getUserHandler)
    mux.Post("/users", createUserHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>HTML Templates</CardTitle>
          <CardDescription>Render dynamic HTML content using Go templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic">Basic Templates</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "html/template"
    "net/http"
    "time"
    "github.com/squirrel-land/squirrel"
)

type PageData struct {
    Title   string
    Message string
    Users   []User
    Now     time.Time
}

type User struct {
    ID    int
    Name  string
    Email string
    Admin bool
}

// Template cache
var templates = template.Must(template.ParseGlob("templates/*.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    
    if err := templates.ExecuteTemplate(w, tmpl, data); err != nil {
        http.Error(w, "Error rendering template", http.StatusInternalServerError)
        return
    }
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    data := PageData{
        Title:   "Welcome to Squirrel",
        Message: "Hello from Squirrel web framework!",
        Now:     time.Now(),
    }
    
    renderTemplate(w, "home.html", data)
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
    users := []User{
        {ID: 1, Name: "Alice", Email: "alice@example.com", Admin: true},
        {ID: 2, Name: "Bob", Email: "bob@example.com", Admin: false},
        {ID: 3, Name: "Charlie", Email: "charlie@example.com", Admin: false},
    }
    
    data := PageData{
        Title: "Users List",
        Users: users,
        Now:   time.Now(),
    }
    
    renderTemplate(w, "users.html", data)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/", homeHandler)
    mux.Get("/users", usersHandler)
    
    // Serve static files
    mux.HandleFunc("/static/", http.StripPrefix("/static/", 
        http.FileServer(http.Dir("static"))).ServeHTTP)
    
    http.ListenAndServe(":8080", mux)
}

/* templates/base.html */
\`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{.Title}}</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/users">Users</a>
    </nav>
    <main>
        {{template "content" .}}
    </main>
    <footer>
        <p>&copy; 2024 Squirrel App. Generated at {{.Now.Format "2006-01-02 15:04:05"}}</p>
    </footer>
</body>
</html>\`

/* templates/home.html */
\`{{template "base.html" .}}
{{define "content"}}
    <h1>{{.Title}}</h1>
    <p>{{.Message}}</p>
    <p>Current time: {{.Now.Format "January 2, 2006 at 3:04 PM"}}</p>
{{end}}\`

/* templates/users.html */
\`{{template "base.html" .}}
{{define "content"}}
    <h1>{{.Title}}</h1>
    {{if .Users}}
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {{range .Users}}
                <tr>
                    <td>{{.ID}}</td>
                    <td>{{.Name}}</td>
                    <td>{{.Email}}</td>
                    <td>{{if .Admin}}Admin{{else}}User{{end}}</td>
                </tr>
                {{end}}
            </tbody>
        </table>
    {{else}}
        <p>No users found.</p>
    {{end}}
{{end}}\``}</code>
              </pre>
            </TabsContent>
            <TabsContent value="advanced">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "html/template"
    "net/http"
    "strings"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Custom template functions
var funcMap = template.FuncMap{
    "upper":      strings.ToUpper,
    "lower":      strings.ToLower,
    "title":      strings.Title,
    "formatDate": formatDate,
    "add":        func(a, b int) int { return a + b },
    "multiply":   func(a, b int) int { return a * b },
    "isEven":     func(n int) bool { return n%2 == 0 },
    "truncate":   truncateString,
}

func formatDate(t time.Time) string {
    return t.Format("January 2, 2006")
}

func truncateString(s string, length int) string {
    if len(s) <= length {
        return s
    }
    return s[:length] + "..."
}

// Template manager with caching and reloading
type TemplateManager struct {
    templates *template.Template
    dev       bool
}

func NewTemplateManager(dev bool) *TemplateManager {
    tm := &TemplateManager{dev: dev}
    tm.loadTemplates()
    return tm
}

func (tm *TemplateManager) loadTemplates() {
    tm.templates = template.Must(
        template.New("").Funcs(funcMap).ParseGlob("templates/*.html"),
    )
}

func (tm *TemplateManager) Render(w http.ResponseWriter, name string, data interface{}) error {
    // Reload templates in development mode
    if tm.dev {
        tm.loadTemplates()
    }
    
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    return tm.templates.ExecuteTemplate(w, name, data)
}

type BlogPost struct {
    ID          int
    Title       string
    Content     string
    Author      string
    PublishedAt time.Time
    Tags        []string
    Views       int
}

func blogHandler(w http.ResponseWriter, r *http.Request) {
    posts := []BlogPost{
        {
            ID:          1,
            Title:       "Getting Started with Squirrel",
            Content:     "Squirrel is a fast and lightweight web framework for Go. In this post, we'll explore how to build your first web application...",
            Author:      "John Doe",
            PublishedAt: time.Now().AddDate(0, 0, -5),
            Tags:        []string{"go", "web", "framework"},
            Views:       1250,
        },
        {
            ID:          2,
            Title:       "Advanced Routing Techniques",
            Content:     "Learn how to implement complex routing patterns in your Squirrel applications. We'll cover middleware, route groups, and parameter validation...",
            Author:      "Jane Smith",
            PublishedAt: time.Now().AddDate(0, 0, -2),
            Tags:        []string{"routing", "middleware", "advanced"},
            Views:       890,
        },
    }
    
    data := map[string]interface{}{
        "Title": "Blog Posts",
        "Posts": posts,
        "Now":   time.Now(),
    }
    
    tm := NewTemplateManager(true) // Development mode
    if err := tm.Render(w, "blog.html", data); err != nil {
        http.Error(w, "Error rendering template", http.StatusInternalServerError)
    }
}

func main() {
    mux := squirrel.NewSqurlMux()
    mux.Get("/blog", blogHandler)
    http.ListenAndServe(":8080", mux)
}

/* templates/blog.html */
\`<!DOCTYPE html>
<html>
<head>
    <title>{{.Title}}</title>
    <style>
        .post { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; }
        .meta { color: #666; font-size: 0.9rem; }
        .tags { margin-top: 0.5rem; }
        .tag { background: #007bff; color: white; padding: 0.2rem 0.5rem; margin-right: 0.5rem; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>{{.Title}}</h1>
    
    {{range $index, $post := .Posts}}
    <article class="post">
        <h2>{{$post.Title | title}}</h2>
        <div class="meta">
            By {{$post.Author}} on {{formatDate $post.PublishedAt}} 
            • {{$post.Views}} views
            • Post #{{add $index 1}}
        </div>
        <p>{{truncate $post.Content 150}}</p>
        <div class="tags">
            {{range $post.Tags}}
                <span class="tag">{{. | upper}}</span>
            {{end}}
        </div>
        {{if isEven $post.Views}}
            <p><em>This post has an even number of views!</em></p>
        {{end}}
    </article>
    {{end}}
    
    <footer>
        <p>Generated at {{.Now.Format "2006-01-02 15:04:05"}}</p>
    </footer>
</body>
</html>\``}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Codes & Headers</CardTitle>
          <CardDescription>Properly set HTTP status codes and response headers</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Response helpers with proper status codes
func sendCreated(w http.ResponseWriter, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated) // 201
    json.NewEncoder(w).Encode(data)
}

func sendNoContent(w http.ResponseWriter) {
    w.WriteHeader(http.StatusNoContent) // 204
}

func sendNotFound(w http.ResponseWriter, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusNotFound) // 404
    json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func sendConflict(w http.ResponseWriter, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusConflict) // 409
    json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func sendUnprocessableEntity(w http.ResponseWriter, errors map[string]string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusUnprocessableEntity) // 422
    json.NewEncoder(w).Encode(map[string]interface{}{
        "error":  "Validation failed",
        "errors": errors,
    })
}

// Custom headers for different scenarios
func apiHandler(w http.ResponseWriter, r *http.Request) {
    // CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    // Security headers
    w.Header().Set("X-Content-Type-Options", "nosniff")
    w.Header().Set("X-Frame-Options", "DENY")
    w.Header().Set("X-XSS-Protection", "1; mode=block")
    
    // API versioning
    w.Header().Set("API-Version", "v1.0")
    
    // Rate limiting info
    w.Header().Set("X-RateLimit-Limit", "100")
    w.Header().Set("X-RateLimit-Remaining", "95")
    w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Hour).Unix()))
    
    data := map[string]string{"message": "API response with custom headers"}
    json.NewEncoder(w).Encode(data)
}

// File download with proper headers
func downloadHandler(w http.ResponseWriter, r *http.Request) {
    filename := squirrel.GetParam(r, "filename")
    
    // Set headers for file download
    w.Header().Set("Content-Type", "application/octet-stream")
    w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
    w.Header().Set("Content-Transfer-Encoding", "binary")
    
    // Simulate file content
    content := []byte("This is the file content for " + filename)
    w.Header().Set("Content-Length", fmt.Sprintf("%d", len(content)))
    
    w.Write(content)
}

// Caching headers
func cachedResourceHandler(w http.ResponseWriter, r *http.Request) {
    // Check if client has cached version
    ifModifiedSince := r.Header.Get("If-Modified-Since")
    lastModified := time.Now().AddDate(0, 0, -1) // Yesterday
    
    if ifModifiedSince != "" {
        if t, err := time.Parse(http.TimeFormat, ifModifiedSince); err == nil {
            if !lastModified.After(t) {
                w.WriteHeader(http.StatusNotModified) // 304
                return
            }
        }
    }
    
    // Set caching headers
    w.Header().Set("Last-Modified", lastModified.Format(http.TimeFormat))
    w.Header().Set("Cache-Control", "public, max-age=3600") // 1 hour
    w.Header().Set("ETag", "\"123456789\"")
    
    // Send content
    w.Header().Set("Content-Type", "application/json")
    data := map[string]interface{}{
        "data":         "This is cached content",
        "last_updated": lastModified,
    }
    json.NewEncoder(w).Encode(data)
}

// Redirect responses
func redirectHandler(w http.ResponseWriter, r *http.Request) {
    redirectType := squirrel.GetParam(r, "type")
    
    switch redirectType {
    case "permanent":
        // 301 Permanent Redirect
        http.Redirect(w, r, "/new-location", http.StatusMovedPermanently)
    case "temporary":
        // 302 Temporary Redirect
        http.Redirect(w, r, "/temp-location", http.StatusFound)
    case "see-other":
        // 303 See Other (after POST)
        http.Redirect(w, r, "/success", http.StatusSeeOther)
    default:
        http.Error(w, "Invalid redirect type", http.StatusBadRequest)
    }
}

// Content negotiation
func contentNegotiationHandler(w http.ResponseWriter, r *http.Request) {
    accept := r.Header.Get("Accept")
    
    data := map[string]interface{}{
        "message": "Hello, World!",
        "time":    time.Now(),
    }
    
    switch {
    case strings.Contains(accept, "application/json"):
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(data)
        
    case strings.Contains(accept, "application/xml"):
        w.Header().Set("Content-Type", "application/xml")
        xml := fmt.Sprintf(\`<?xml version="1.0" encoding="UTF-8"?>
<response>
    <message>%s</message>
    <time>%s</time>
</response>\`, data["message"], data["time"])
        fmt.Fprint(w, xml)
        
    case strings.Contains(accept, "text/plain"):
        w.Header().Set("Content-Type", "text/plain")
        fmt.Fprintf(w, "Message: %s\\nTime: %s", data["message"], data["time"])
        
    default:
        // Default to JSON
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(data)
    }
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/api/data", apiHandler)
    mux.Get("/download/{filename}", downloadHandler)
    mux.Get("/cached", cachedResourceHandler)
    mux.Get("/redirect/{type}", redirectHandler)
    mux.Get("/content", contentNegotiationHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Streaming</CardTitle>
          <CardDescription>Stream large responses and implement Server-Sent Events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="streaming" className="w-full">
            <TabsList>
              <TabsTrigger value="streaming">Response Streaming</TabsTrigger>
              <TabsTrigger value="sse">Server-Sent Events</TabsTrigger>
            </TabsList>
            <TabsContent value="streaming">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Stream large JSON array
func streamJSONHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    // Start JSON array
    fmt.Fprint(w, "[")
    
    // Stream items one by one
    for i := 0; i < 1000; i++ {
        if i > 0 {
            fmt.Fprint(w, ",")
        }
        
        item := map[string]interface{}{
            "id":    i,
            "name":  fmt.Sprintf("Item %d", i),
            "value": i * 10,
            "time":  time.Now(),
        }
        
        json.NewEncoder(w).Encode(item)
        
        // Flush to send data immediately
        if flusher, ok := w.(http.Flusher); ok {
            flusher.Flush()
        }
        
        // Small delay to simulate processing
        time.Sleep(10 * time.Millisecond)
    }
    
    // Close JSON array
    fmt.Fprint(w, "]")
}

// Stream CSV data
func streamCSVHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/csv")
    w.Header().Set("Content-Disposition", "attachment; filename=\"data.csv\"")
    
    // Write CSV header
    fmt.Fprint(w, "ID,Name,Email,Created\\n")
    
    // Stream CSV rows
    for i := 1; i <= 10000; i++ {
        row := fmt.Sprintf("%d,User%d,user%d@example.com,%s\\n", 
            i, i, i, time.Now().Format("2006-01-02"))
        
        fmt.Fprint(w, row)
        
        if flusher, ok := w.(http.Flusher); ok {
            flusher.Flush()
        }
        
        // Batch processing - flush every 100 rows
        if i%100 == 0 {
            time.Sleep(1 * time.Millisecond)
        }
    }
}

// Progress tracking for long operations
func longOperationHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    
    steps := []string{
        "Initializing...",
        "Loading data...",
        "Processing records...",
        "Validating results...",
        "Generating report...",
        "Finalizing...",
        "Complete!",
    }
    
    for i, step := range steps {
        progress := float64(i+1) / float64(len(steps)) * 100
        message := fmt.Sprintf("[%.1f%%] %s\\n", progress, step)
        
        fmt.Fprint(w, message)
        
        if flusher, ok := w.(http.Flusher); ok {
            flusher.Flush()
        }
        
        // Simulate work
        time.Sleep(500 * time.Millisecond)
    }
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="sse">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Server-Sent Events implementation
func sseHandler(w http.ResponseWriter, r *http.Request) {
    // Set SSE headers
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    
    // Send initial connection message
    fmt.Fprintf(w, "data: Connected to SSE stream\\n\\n")
    
    if flusher, ok := w.(http.Flusher); ok {
        flusher.Flush()
    }
    
    // Create ticker for periodic updates
    ticker := time.NewTicker(2 * time.Second)
    defer ticker.Stop()
    
    // Listen for client disconnect
    ctx := r.Context()
    
    counter := 0
    for {
        select {
        case <-ctx.Done():
            // Client disconnected
            return
            
        case <-ticker.C:
            counter++
            
            // Send different types of events
            if counter%3 == 0 {
                // Custom event type
                fmt.Fprintf(w, "event: heartbeat\\n")
                fmt.Fprintf(w, "data: {\"type\": \"heartbeat\", \"count\": %d}\\n\\n", counter)
            } else {
                // Default event
                data := map[string]interface{}{
                    "message":   fmt.Sprintf("Update #%d", counter),
                    "timestamp": time.Now().Unix(),
                    "random":    time.Now().Nanosecond() % 100,
                }
                
                jsonData, _ := json.Marshal(data)
                fmt.Fprintf(w, "data: %s\\n\\n", jsonData)
            }
            
            if flusher, ok := w.(http.Flusher); ok {
                flusher.Flush()
            }
            
            // Stop after 30 updates
            if counter >= 30 {
                fmt.Fprintf(w, "event: close\\n")
                fmt.Fprintf(w, "data: Stream ending\\n\\n")
                if flusher, ok := w.(http.Flusher); ok {
                    flusher.Flush()
                }
                return
            }
        }
    }
}

// SSE client example page
func sseClientHandler(w http.ResponseWriter, r *http.Request) {
    html := \`<!DOCTYPE html>
<html>
<head>
    <title>Server-Sent Events Demo</title>
</head>
<body>
    <h1>Server-Sent Events Demo</h1>
    <div id="messages"></div>
    <button onclick="startSSE()">Start Stream</button>
    <button onclick="stopSSE()">Stop Stream</button>
    
    <script>
        let eventSource;
        
        function startSSE() {
            eventSource = new EventSource('/sse');
            
            eventSource.onmessage = function(event) {
                addMessage('Message: ' + event.data);
            };
            
            eventSource.addEventListener('heartbeat', function(event) {
                addMessage('Heartbeat: ' + event.data);
            });
            
            eventSource.addEventListener('close', function(event) {
                addMessage('Stream closed: ' + event.data);
                eventSource.close();
            });
            
            eventSource.onerror = function(event) {
                addMessage('Error occurred');
            };
        }
        
        function stopSSE() {
            if (eventSource) {
                eventSource.close();
                addMessage('Connection closed by client');
            }
        }
        
        function addMessage(message) {
            const div = document.createElement('div');
            div.textContent = new Date().toLocaleTimeString() + ': ' + message;
            document.getElementById('messages').appendChild(div);
        }
    </script>
</body>
</html>\`
    
    w.Header().Set("Content-Type", "text/html")
    fmt.Fprint(w, html)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/stream/json", streamJSONHandler)
    mux.Get("/stream/csv", streamCSVHandler)
    mux.Get("/stream/progress", longOperationHandler)
    mux.Get("/sse", sseHandler)
    mux.Get("/sse-client", sseClientHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Best Practice:</strong> Always set appropriate Content-Type headers, use proper HTTP status codes, and
          implement caching strategies for better performance and user experience.
        </AlertDescription>
      </Alert>
    </div>
  )
}
