import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function RequestPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Core</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Request</h1>
        <p className="text-xl text-muted-foreground">
          The Request type represents an HTTP request with methods for accessing request data.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type Request struct {
    Conn          net.Conn
    Method        string
    Path          string
    Body          io.ReadCloser
    Headers       map[string]string
    Url           *url.URL
    Params        map[string]string
    ContentLength int64
    Close         bool
    Queries       map[string][]string
    Cookies       []*cookies.Cookie
}`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Methods</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">ReadBodyAsString()</h3>
            <p className="text-muted-foreground">Reads the request body and returns it as a string.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Request) ReadBodyAsString() (string, error)</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Post("/api/data", func(req *Request, res *Response) {
    body, err := req.ReadBodyAsString()
    if err != nil {
        res.SetStatus(400)
        res.JSON(map[string]string{"error": "Failed to read body"})
        res.Send()
        return
    }
    
    // Process the body string
    fmt.Printf("Received body: %s\\n", body)
    
    res.JSON(map[string]string{"received": body})
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Param()</h3>
            <p className="text-muted-foreground">
              Retrieves a URL parameter by name from route patterns like{" "}
              <code className="bg-muted px-1 py-0.5 rounded">/users/:id</code>.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Request) Param(paramName string) string</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`// Route: /users/:id/posts/:postId
server.Get("/users/:id/posts/:postId", func(req *Request, res *Response) {
    userID := req.Param("id")
    postID := req.Param("postId")
    
    res.JSON(map[string]string{
        "userId": userID,
        "postId": postID,
        "message": fmt.Sprintf("User %s, Post %s", userID, postID),
    })
    res.Send()
})

// GET /users/123/posts/456
// Returns: {"userId": "123", "postId": "456", "message": "User 123, Post 456"}`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Query()</h3>
            <p className="text-muted-foreground">
              Retrieves query parameters from the URL. Supports multi-value query parameters.
            </p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Request) Query() []string</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/search", func(req *Request, res *Response) {
    queries := req.Query()
    
    // Access query parameters from req.Queries map
    searchTerms := req.Queries["q"]        // []string
    categories := req.Queries["category"]  // []string
    
    res.JSON(map[string]interface{}{
        "searchTerms": searchTerms,
        "categories": categories,
        "allQueries": queries,
    })
    res.Send()
})

// GET /search?q=golang&q=web&category=framework&category=backend
// Returns query parameters as arrays`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">GetCookie()</h3>
            <p className="text-muted-foreground">Gets a cookie by its name from the request.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Request) GetCookie(name string) *cookies.Cookie</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/profile", func(req *Request, res *Response) {
    sessionCookie := req.GetCookie("session_id")
    if sessionCookie == nil {
        res.SetStatus(401)
        res.JSON(map[string]string{"error": "No session found"})
        res.Send()
        return
    }
    
    // Use the cookie value
    sessionID := sessionCookie.Value
    
    res.JSON(map[string]string{
        "sessionId": sessionID,
        "message": "Welcome back!",
    })
    res.Send()
})`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">OriginalUrl()</h3>
            <p className="text-muted-foreground">Retrieves the original URL of the incoming request.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func (r *Request) OriginalUrl() *url.URL</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server.Get("/debug", func(req *Request, res *Response) {
    originalURL := req.OriginalUrl()
    
    res.JSON(map[string]interface{}{
        "scheme": originalURL.Scheme,
        "host": originalURL.Host,
        "path": originalURL.Path,
        "rawQuery": originalURL.RawQuery,
        "fragment": originalURL.Fragment,
        "fullURL": originalURL.String(),
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
          The Request struct provides direct access to the underlying <code>net.Conn</code>, HTTP headers, and parsed
          URL components for advanced use cases.
        </AlertDescription>
      </Alert>
    </div>
  )
}
