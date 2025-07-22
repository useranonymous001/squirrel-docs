export default function StaticFilesGuidePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Static Files Guide</h1>
        <p className="text-xl text-muted-foreground">Serve static assets efficiently and securely with Squirrel</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Basic Static File Serving</h2>
          <p className="mb-4">Serve static files from a directory:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`mux := squirrel.NewSqurlMux()

// Serve files from ./static directory
mux.Handle("/static/", squirrel.StripPrefix("/static/", squirrel.FileServer(squirrel.Dir("./static"))))

// Alternative: serve a specific file
mux.HandleFunc("/favicon.ico", func(w *squirrel.Response, r *squirrel.Request) {
    squirrel.ServeFile(w, r, "./static/favicon.ico")
})

// Serve from multiple directories
mux.Handle("/assets/", squirrel.StripPrefix("/assets/", squirrel.FileServer(squirrel.Dir("./assets"))))
mux.Handle("/uploads/", squirrel.StripPrefix("/uploads/", squirrel.FileServer(squirrel.Dir("./uploads"))))`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Custom File Server</h2>
          <p className="mb-4">Create a custom file server with additional features:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func CustomFileServer(root string) squirrel.HandlerFunc {
    fs := squirrel.FileServer(squirrel.Dir(root))
    
    return func(w *squirrel.Response, r *squirrel.Request) {
        // Security: prevent directory traversal
        if strings.Contains(r.URL.Path, "..") {
            w.WriteStatus(400)
            w.WriteString("Invalid path")
            return
        }
        
        // Add security headers
        w.Header().Set("X-Content-Type-Options", "nosniff")
        w.Header().Set("X-Frame-Options", "DENY")
        
        // Set cache headers for static assets
        if isStaticAsset(r.URL.Path) {
            w.Header().Set("Cache-Control", "public, max-age=31536000") // 1 year
        }
        
        fs.ServeHTTP(w, r)
    }
}

func isStaticAsset(path string) bool {
    staticExts := []string{".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg"}
    ext := strings.ToLower(filepath.Ext(path))
    
    for _, staticExt := range staticExts {
        if ext == staticExt {
            return true
        }
    }
    return false
}

// Usage
mux.Handle("/static/", squirrel.StripPrefix("/static/", CustomFileServer("./static")))`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Content Type Detection</h2>
          <p className="mb-4">Automatically set correct content types:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func ServeFileWithContentType(w *squirrel.Response, r *squirrel.Request, filepath string) {
    // Open the file
    file, err := os.Open(filepath)
    if err != nil {
        w.WriteStatus(404)
        w.WriteString("File not found")
        return
    }
    defer file.Close()
    
    // Get file info
    fileInfo, err := file.Stat()
    if err != nil {
        w.WriteStatus(500)
        w.WriteString("Error reading file")
        return
    }
    
    // Detect content type
    buffer := make([]byte, 512)
    _, err = file.Read(buffer)
    if err != nil {
        w.WriteStatus(500)
        w.WriteString("Error reading file")
        return
    }
    
    contentType := http.DetectContentType(buffer)
    
    // Override for specific extensions
    ext := strings.ToLower(filepath.Ext(filepath))
    switch ext {
    case ".css":
        contentType = "text/css"
    case ".js":
        contentType = "application/javascript"
    case ".json":
        contentType = "application/json"
    case ".xml":
        contentType = "application/xml"
    }
    
    // Set headers
    w.Header().Set("Content-Type", contentType)
    w.Header().Set("Content-Length", fmt.Sprintf("%d", fileInfo.Size()))
    
    // Reset file pointer to beginning
    file.Seek(0, 0)
    
    // Copy file to response
    io.Copy(w, file)
}

// Usage in handler
func serveAssetHandler(w *squirrel.Response, r *squirrel.Request) {
    filename := r.PathValue("filename")
    filepath := "./assets/" + filename
    
    ServeFileWithContentType(w, r, filepath)
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">File Upload Handling</h2>
          <p className="mb-4">Handle file uploads securely:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func uploadHandler(w *squirrel.Response, r *squirrel.Request) {
    // Limit upload size (10MB)
    r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
    
    // Parse multipart form
    if err := r.ParseMultipartForm(10 << 20); err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "File too large"})
        return
    }
    
    // Get the file
    file, header, err := r.FormFile("file")
    if err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "No file provided"})
        return
    }
    defer file.Close()
    
    // Validate file type
    allowedTypes := map[string]bool{
        "image/jpeg": true,
        "image/png":  true,
        "image/gif":  true,
        "text/plain": true,
    }
    
    // Read first 512 bytes to detect content type
    buffer := make([]byte, 512)
    _, err = file.Read(buffer)
    if err != nil {
        w.WriteStatus(500)
        w.JSON(map[string]string{"error": "Error reading file"})
        return
    }
    
    contentType := http.DetectContentType(buffer)
    if !allowedTypes[contentType] {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "File type not allowed"})
        return
    }
    
    // Reset file pointer
    file.Seek(0, 0)
    
    // Generate unique filename
    ext := filepath.Ext(header.Filename)
    filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
    filepath := "./uploads/" + filename
    
    // Create the file
    dst, err := os.Create(filepath)
    if err != nil {
        w.WriteStatus(500)
        w.JSON(map[string]string{"error": "Error saving file"})
        return
    }
    defer dst.Close()
    
    // Copy file content
    _, err = io.Copy(dst, file)
    if err != nil {
        w.WriteStatus(500)
        w.JSON(map[string]string{"error": "Error saving file"})
        return
    }
    
    w.JSON(map[string]string{
        "filename": filename,
        "size":     fmt.Sprintf("%d", header.Size),
        "type":     contentType,
    })
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Caching Strategies</h2>
          <p className="mb-4">Implement efficient caching for static assets:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func CachingFileServer(root string) squirrel.HandlerFunc {
    fs := squirrel.FileServer(squirrel.Dir(root))
    
    return func(w *squirrel.Response, r *squirrel.Request) {
        // Get file info for ETag generation
        filepath := path.Join(root, r.URL.Path)
        fileInfo, err := os.Stat(filepath)
        if err != nil {
            w.WriteStatus(404)
            return
        }
        
        // Generate ETag based on file modification time and size
        etag := fmt.Sprintf(\`"%x-%x"\`, fileInfo.ModTime().Unix(), fileInfo.Size())
        
        // Check If-None-Match header
        if match := r.Header.Get("If-None-Match"); match != "" {
            if match == etag {
                w.WriteStatus(304) // Not Modified
                return
            }
        }
        
        // Set caching headers
        w.Header().Set("ETag", etag)
        w.Header().Set("Last-Modified", fileInfo.ModTime().UTC().Format(http.TimeFormat))
        
        // Set cache duration based on file type
        ext := strings.ToLower(filepath.Ext(r.URL.Path))
        switch ext {
        case ".css", ".js":
            w.Header().Set("Cache-Control", "public, max-age=86400") // 1 day
        case ".png", ".jpg", ".jpeg", ".gif", ".ico":
            w.Header().Set("Cache-Control", "public, max-age=604800") // 1 week
        case ".woff", ".woff2", ".ttf":
            w.Header().Set("Cache-Control", "public, max-age=2592000") // 30 days
        default:
            w.Header().Set("Cache-Control", "public, max-age=3600") // 1 hour
        }
        
        fs.ServeHTTP(w, r)
    }
}

// Usage
mux.Handle("/static/", squirrel.StripPrefix("/static/", CachingFileServer("./static")))`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Secure File Serving</h2>
          <p className="mb-4">Implement security measures for file serving:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func SecureFileServer(root string, allowedExts []string) squirrel.HandlerFunc {
    return func(w *squirrel.Response, r *squirrel.Request) {
        // Security checks
        if strings.Contains(r.URL.Path, "..") {
            w.WriteStatus(400)
            w.WriteString("Invalid path")
            return
        }
        
        // Check file extension
        ext := strings.ToLower(filepath.Ext(r.URL.Path))
        allowed := false
        for _, allowedExt := range allowedExts {
            if ext == allowedExt {
                allowed = true
                break
            }
        }
        
        if !allowed {
            w.WriteStatus(403)
            w.WriteString("File type not allowed")
            return
        }
        
        // Construct safe file path
        cleanPath := filepath.Clean(r.URL.Path)
        fullPath := filepath.Join(root, cleanPath)
        
        // Ensure the path is within the root directory
        if !strings.HasPrefix(fullPath, filepath.Clean(root)+string(os.PathSeparator)) {
            w.WriteStatus(403)
            w.WriteString("Access denied")
            return
        }
        
        // Check if file exists and is not a directory
        fileInfo, err := os.Stat(fullPath)
        if err != nil {
            w.WriteStatus(404)
            w.WriteString("File not found")
            return
        }
        
        if fileInfo.IsDir() {
            w.WriteStatus(403)
            w.WriteString("Directory listing not allowed")
            return
        }
        
        // Add security headers
        w.Header().Set("X-Content-Type-Options", "nosniff")
        w.Header().Set("X-Frame-Options", "DENY")
        w.Header().Set("Content-Security-Policy", "default-src 'none'")
        
        // Serve the file
        squirrel.ServeFile(w, r, fullPath)
    }
}

// Usage with allowed extensions
allowedExts := []string{".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg"}
mux.Handle("/assets/", squirrel.StripPrefix("/assets/", SecureFileServer("./assets", allowedExts)))`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Compression</h2>
          <p className="mb-4">Enable gzip compression for static files:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`func CompressedFileServer(root string) squirrel.HandlerFunc {
    return func(w *squirrel.Response, r *squirrel.Request) {
        // Check if client accepts gzip
        if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
            // Serve uncompressed
            squirrel.FileServer(squirrel.Dir(root)).ServeHTTP(w, r)
            return
        }
        
        // Check if file should be compressed
        ext := strings.ToLower(filepath.Ext(r.URL.Path))
        compressible := map[string]bool{
            ".css":  true,
            ".js":   true,
            ".html": true,
            ".json": true,
            ".xml":  true,
            ".svg":  true,
        }
        
        if !compressible[ext] {
            // Serve uncompressed for non-compressible files
            squirrel.FileServer(squirrel.Dir(root)).ServeHTTP(w, r)
            return
        }
        
        // Set compression headers
        w.Header().Set("Content-Encoding", "gzip")
        w.Header().Set("Vary", "Accept-Encoding")
        
        // Create gzip writer
        gz := gzip.NewWriter(w)
        defer gz.Close()
        
        // Create a custom ResponseWriter that writes to gzip
        gzw := &gzipResponseWriter{
            ResponseWriter: w,
            Writer:         gz,
        }
        
        squirrel.FileServer(squirrel.Dir(root)).ServeHTTP(gzw, r)
    }
}

type gzipResponseWriter struct {
    squirrel.ResponseWriter
    io.Writer
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
    return w.Writer.Write(b)
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}
