import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function ResponsePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Core</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Response</h1>
        <p className="text-xl text-muted-foreground">
          The Response type represents an HTTP response with methods for setting headers, status, and body content.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type Response struct {
    conn        net.Conn
    headers     map[string]string
    contentType string
    body        io.ReadCloser
    statusCode  int
    cookies     []*cookies.Cookie
}`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Methods</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">SetHeader()</h3>
            <p className="text-muted-foreground">Sets an HTTP header for the response.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) SetHeader(key, value string)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/api/data", func(req *Request, res *Response) {
    // Set custom headers
    res.SetHeader("X-API-Version", "1.0")
    res.SetHeader("Cache-Control", "no-cache")
    res.SetHeader("Access-Control-Allow-Origin", "*")
    
    // Set content type
    res.SetHeader("Content-Type", "application/json")
    
    res.JSON(map[string]string{"message": "Hello World"})
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">SetStatus()</h3>
            <p className="text-muted-foreground">Sets the HTTP status code for the response.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) SetStatus(status int)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Post("/api/users", func(req *Request, res *Response) {
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400) // Bad Request
        res.JSON(map[string]string{"error": "Invalid request body"})
        res.Send()
        return
    }
    
    // Simulate user creation
    if body == "" {
        res.SetStatus(422) // Unprocessable Entity
        res.JSON(map[string]string{"error": "Empty body not allowed"})
        res.Send()
        return
    }
    
    res.SetStatus(201) // Created
    res.JSON(map[string]string{"message": "User created successfully"})
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Write()</h3>
            <p className="text-muted-foreground">Writes a string to the response body.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) Write(body string)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/", func(req *Request, res *Response) {
    res.Write("Hello, World!")
    res.Send()
})

server.Get("/html", func(req *Request, res *Response) {
    res.SetHeader("Content-Type", "text/html")
    res.Write(\`<!DOCTYPE html>
<html>
<head><title>Squirrel App</title></head>
<body>
    <h1>Welcome to Squirrel Framework!</h1>
    <p>This is a simple HTML response.</p>
</body>
</html>\`)
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">WriteBytes()</h3>
            <p className="text-muted-foreground">Writes bytes to the response body.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) WriteBytes(b []byte)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/binary", func(req *Request, res *Response) {
    // Example: serving binary data
    data := []byte{0x89, 0x50, 0x4E, 0x47} // PNG header
    
    res.SetHeader("Content-Type", "application/octet-stream")
    res.SetHeader("Content-Disposition", "attachment; filename=data.bin")
    res.WriteBytes(data)
    res.Send()
})

server.Post("/upload", func(req *Request, res *Response) {
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.WriteBytes([]byte("Error reading body"))
        res.Send()
        return
    }
    
    // Convert string to bytes and echo back
    res.WriteBytes([]byte("Received: " + body))
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">JSON()</h3>
            <p className="text-muted-foreground">Writes JSON data to the response and sets appropriate content type.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) JSON(data interface{})</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

server.Get("/api/users", func(req *Request, res *Response) {
    users := []User{
        {ID: 1, Name: "John Doe", Email: "john@example.com"},
        {ID: 2, Name: "Jane Smith", Email: "jane@example.com"},
    }
    
    res.JSON(users)
    res.Send()
})

server.Get("/api/status", func(req *Request, res *Response) {
    status := map[string]interface{}{
        "server": "Squirrel Framework",
        "version": "1.0.0",
        "uptime": time.Since(startTime).Seconds(),
        "timestamp": time.Now().Unix(),
    }
    
    res.JSON(status)
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">SetCookie()</h3>
            <p className="text-muted-foreground">Sets a cookie in the response headers.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) SetCookie(cookie *cookies.Cookie)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Post("/login", func(req *Request, res *Response) {
    // Create session cookie
    sessionCookie := &cookies.Cookie{
        Name:     "session_id",
        Value:    "abc123xyz789",
        Path:     "/",
        MaxAge:   3600, // 1 hour
        HttpOnly: true,
        Secure:   true,
        SameSite: cookies.SameSiteStrictMode,
    }
    
    res.SetCookie(sessionCookie)
    
    // Set user preference cookie
    prefCookie := &cookies.Cookie{
        Name:   "theme",
        Value:  "dark",
        Path:   "/",
        MaxAge: 86400 * 30, // 30 days
    }
    
    res.SetCookie(prefCookie)
    
    res.JSON(map[string]string{"message": "Login successful"})
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Send()</h3>
            <p className="text-muted-foreground">
              Sends the response to the client. Must be called to complete the response.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Response) Send()</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/api/health", func(req *Request, res *Response) {
    res.SetStatus(200)
    res.SetHeader("X-Health-Check", "OK")
    res.JSON(map[string]string{
        "status": "healthy",
        "timestamp": time.Now().Format(time.RFC3339),
    })
    res.Send() // Always call Send() to complete the response
})

// Example with conditional response
server.Get("/api/data/:id", func(req *Request, res *Response) {
    id := req.Param("id")
    
    if id == "" {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "ID parameter required"})
        res.Send()
        return
    }
    
    // Simulate data lookup
    if id == "404" {
        res.SetStatus(404)
        res.JSON(map[string]string{"error": "Data not found"})
        res.Send()
        return
    }
    
    res.JSON(map[string]string{
        "id": id,
        "data": "Sample data for ID " + id,
    })
    res.Send()
})`}</code>
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
          Always call <code>Send()</code> at the end of your handler to complete the HTTP response. The response will
          not be sent to the client until this method is called.
        </AlertDescription>
      </Alert>
    </div>
  )
}
