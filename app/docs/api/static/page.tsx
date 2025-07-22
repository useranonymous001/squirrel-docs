import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function StaticPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Function</Badge>
          <Badge variant="outline">Static Files</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">ServeStatic</h1>
        <p className="text-xl text-muted-foreground">
          Serve static files from a directory with customizable URL prefix and efficient file handling.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Function Signature</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`func ServeStatic(prefix, dirpath string)`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Static File Serving</h3>
            <p className="text-muted-foreground">Serve files from a public directory.</p>

            <Tabs defaultValue="example" className="w-full">
              <TabsList>
                <TabsTrigger value="example">Example</TabsTrigger>
                <TabsTrigger value="structure">Directory Structure</TabsTrigger>
              </TabsList>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`func main() {
    server := SpawnServer()
    
    // Serve static files from "public" directory
    // URL prefix: "/static"
    // Directory: "./public"
    server.ServeStatic("/static", "public")
    
    // API routes
    server.Get("/api/health", func(req *Request, res *Response) {
        res.JSON(map[string]string{"status": "ok"})
        res.Send()
    })
    
    server.Listen(":8080")
}

// Now you can access:
// http://localhost:8080/static/style.css -> serves ./public/style.css
// http://localhost:8080/static/js/app.js -> serves ./public/js/app.js
// http://localhost:8080/static/images/logo.png -> serves ./public/images/logo.png`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="structure">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`project/
├── main.go
└── public/
    ├── index.html
    ├── style.css
    ├── js/
    │   ├── app.js
    │   └── utils.js
    ├── images/
    │   ├── logo.png
    │   └── favicon.ico
    └── fonts/
        └── roboto.woff2

// Accessible URLs:
// /static/index.html
// /static/style.css
// /static/js/app.js
// /static/js/utils.js
// /static/images/logo.png
// /static/images/favicon.ico
// /static/fonts/roboto.woff2`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Multiple Static Directories</h3>
            <p className="text-muted-foreground">Serve different types of static content from separate directories.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func main() {
    server := SpawnServer()
    
    // Serve CSS and JS assets
    server.ServeStatic("/assets", "static/assets")
    
    // Serve uploaded files
    server.ServeStatic("/uploads", "storage/uploads")
    
    // Serve documentation
    server.ServeStatic("/docs", "documentation")
    
    // Serve images with different prefix
    server.ServeStatic("/media", "public/images")
    
    server.Listen(":8080")
}

// Directory structure:
// static/assets/     -> /assets/*
// storage/uploads/   -> /uploads/*
// documentation/     -> /docs/*
// public/images/     -> /media/*`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">SPA (Single Page Application) Setup</h3>
            <p className="text-muted-foreground">Serve a React/Vue/Angular app with fallback to index.html.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func main() {
    server := SpawnServer()
    
    // Serve static assets (CSS, JS, images)
    server.ServeStatic("/static", "build/static")
    
    // API routes
    server.Get("/api/users", func(req *Request, res *Response) {
        res.JSON([]map[string]string{
            {"id": "1", "name": "John Doe"},
        })
        res.Send()
    })
    
    // Catch-all route for SPA (must be last)
    server.Get("/*", func(req *Request, res *Response) {
        // Serve index.html for all non-API routes
        file, err := os.Open("build/index.html")
        if err != nil {
            res.SetStatus(404)
            res.Write("Page not found")
            res.Send()
            return
        }
        defer file.Close()
        
        res.SetHeader("Content-Type", "text/html")
        res.SetBody(file)
        res.Send()
    })
    
    server.Listen(":8080")
}

// This setup allows:
// /static/css/app.css -> serves build/static/css/app.css
// /static/js/app.js -> serves build/static/js/app.js
// / -> serves build/index.html
// /about -> serves build/index.html (SPA routing)
// /users/123 -> serves build/index.html (SPA routing)
// /api/users -> API response (not index.html)`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Static Files with Custom Headers</h3>
            <p className="text-muted-foreground">Add custom headers to static files using middleware.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func main() {
    server := SpawnServer()
    
    // Middleware for static file caching
    staticCacheMiddleware := func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            // Only apply to static files
            if strings.HasPrefix(req.Path, "/static/") {
                // Set cache headers
                res.SetHeader("Cache-Control", "public, max-age=31536000") // 1 year
                res.SetHeader("Expires", time.Now().AddDate(1, 0, 0).Format(http.TimeFormat))
                
                // Set security headers
                res.SetHeader("X-Content-Type-Options", "nosniff")
                
                // Set CORS headers for fonts/assets
                if strings.HasSuffix(req.Path, ".woff2") || 
                   strings.HasSuffix(req.Path, ".woff") ||
                   strings.HasSuffix(req.Path, ".ttf") {
                    res.SetHeader("Access-Control-Allow-Origin", "*")
                }
            }
            
            next(req, res)
        }
    }
    
    // Apply middleware globally
    server.Use(staticCacheMiddleware)
    
    // Serve static files
    server.ServeStatic("/static", "public")
    
    server.Listen(":8080")
}`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">File Upload and Serving</h3>
            <p className="text-muted-foreground">Handle file uploads and serve them statically.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`import (
    "io"
    "os"
    "path/filepath"
    "strings"
)

func main() {
    server := SpawnServer()
    
    // Serve uploaded files
    server.ServeStatic("/uploads", "storage/uploads")
    
    // File upload endpoint
    server.Post("/api/upload", func(req *Request, res *Response) {
        // Read the uploaded file (simplified)
        body, err := req.ReadBodyAsString()
        if err != nil {
            res.SetStatus(400)
            res.JSON(map[string]string{"error": "Failed to read file"})
            res.Send()
            return
        }
        
        // Generate unique filename
        filename := fmt.Sprintf("file_%d.txt", time.Now().UnixNano())
        filepath := filepath.Join("storage/uploads", filename)
        
        // Ensure upload directory exists
        os.MkdirAll("storage/uploads", 0755)
        
        // Save file
        err = os.WriteFile(filepath, []byte(body), 0644)
        if err != nil {
            res.SetStatus(500)
            res.JSON(map[string]string{"error": "Failed to save file"})
            res.Send()
            return
        }
        
        res.SetStatus(201)
        res.JSON(map[string]string{
            "message": "File uploaded successfully",
            "filename": filename,
            "url": "/uploads/" + filename,
        })
        res.Send()
    })
    
    // List uploaded files
    server.Get("/api/files", func(req *Request, res *Response) {
        files, err := os.ReadDir("storage/uploads")
        if err != nil {
            res.SetStatus(500)
            res.JSON(map[string]string{"error": "Failed to read directory"})
            res.Send()
            return
        }
        
        var fileList []map[string]interface{}
        for _, file := range files {
            if !file.IsDir() {
                info, _ := file.Info()
                fileList = append(fileList, map[string]interface{}{
                    "name": file.Name(),
                    "size": info.Size(),
                    "url": "/uploads/" + file.Name(),
                    "modified": info.ModTime(),
                })
            }
        }
        
        res.JSON(map[string]interface{}{
            "files": fileList,
            "count": len(fileList),
        })
        res.Send()
    })
    
    server.Listen(":8080")
}`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Security Considerations</h3>
            <p className="text-muted-foreground">Important security practices when serving static files.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`func main() {
    server := SpawnServer()
    
    // Security middleware for static files
    secureStaticMiddleware := func(next HandlerFunc) HandlerFunc {
        return func(req *Request, res *Response) {
            // Only apply to static file routes
            if strings.HasPrefix(req.Path, "/static/") {
                // Prevent directory traversal attacks
                if strings.Contains(req.Path, "..") {
                    res.SetStatus(403)
                    res.JSON(map[string]string{"error": "Forbidden"})
                    res.Send()
                    return
                }
                
                // Block access to sensitive files
                blockedExtensions := []string{".env", ".config", ".key", ".pem"}
                for _, ext := range blockedExtensions {
                    if strings.HasSuffix(req.Path, ext) {
                        res.SetStatus(403)
                        res.JSON(map[string]string{"error": "Access denied"})
                        res.Send()
                        return
                    }
                }
                
                // Set security headers
                res.SetHeader("X-Content-Type-Options", "nosniff")
                res.SetHeader("X-Frame-Options", "DENY")
                res.SetHeader("Referrer-Policy", "strict-origin-when-cross-origin")
            }
            
            next(req, res)
        }
    }
    
    server.Use(secureStaticMiddleware)
    server.ServeStatic("/static", "public")
    
    server.Listen(":8080")
}

// Security checklist for static files:
// ✅ Validate file paths to prevent directory traversal
// ✅ Block access to sensitive file types
// ✅ Set appropriate security headers
// ✅ Use HTTPS in production
// ✅ Implement proper file permissions
// ✅ Consider using a CDN for better performance and security`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The <code>ServeStatic</code> function provides efficient static file serving with automatic MIME type
          detection. Always validate file paths and implement security measures to prevent directory traversal attacks
          and unauthorized access to sensitive files.
        </AlertDescription>
      </Alert>
    </div>
  )
}
