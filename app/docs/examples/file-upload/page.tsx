export default function FileUploadExamplePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">File Upload Example</h1>
        <p className="text-xl text-muted-foreground">Handle file uploads with validation, storage, and serving</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Complete File Upload Server</h2>
          <p className="mb-4">This example demonstrates secure file upload handling:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`package main

import (
    "crypto/md5"
    "fmt"
    "io"
    "log"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "strconv"
    "strings"
    "time"
    "github.com/user001/squirrel"
)

// File metadata
type FileInfo struct {
    ID          string    \`json:"id"\`
    OriginalName string   \`json:"original_name"\`
    Filename    string    \`json:"filename"\`
    Size        int64     \`json:"size"\`
    ContentType string    \`json:"content_type"\`
    UploadedAt  time.Time \`json:"uploaded_at"\`
    MD5Hash     string    \`json:"md5_hash"\`
}

// Configuration
const (
    MaxFileSize   = 10 << 20 // 10MB
    UploadDir     = "./uploads"
    ThumbnailDir  = "./thumbnails"
)

// Allowed file types
var allowedTypes = map[string]bool{
    "image/jpeg": true,
    "image/png":  true,
    "image/gif":  true,
    "text/plain": true,
    "application/pdf": true,
}

// File extensions
var allowedExtensions = map[string]bool{
    ".jpg":  true,
    ".jpeg": true,
    ".png":  true,
    ".gif":  true,
    ".txt":  true,
    ".pdf":  true,
}

func main() {
    // Create upload directories
    os.MkdirAll(UploadDir, 0755)
    os.MkdirAll(ThumbnailDir, 0755)
    
    mux := squirrel.NewSqurlMux()
    
    // Middleware
    mux.Use(squirrel.LoggingMiddleware())
    mux.Use(squirrel.RecoveryMiddleware())
    mux.Use(corsMiddleware())
    
    // Upload endpoints
    mux.HandleFunc("POST /upload", uploadHandler)
    mux.HandleFunc("POST /upload/multiple", multipleUploadHandler)
    mux.HandleFunc("GET /files/{id}", serveFileHandler)
    mux.HandleFunc("GET /files/{id}/info", fileInfoHandler)
    mux.HandleFunc("DELETE /files/{id}", deleteFileHandler)
    
    // List files
    mux.HandleFunc("GET /files", listFilesHandler)
    
    // Upload form (for testing)
    mux.HandleFunc("GET /", uploadFormHandler)
    
    fmt.Println("File upload server starting on http://localhost:8080")
    log.Fatal(squirrel.ListenAndServe(":8080", mux))
}

func corsMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
            
            if r.Method == "OPTIONS" {
                w.WriteStatus(200)
                return
            }
            
            next(w, r)
        }
    }
}

// Single file upload handler
func uploadHandler(w *squirrel.Response, r *squirrel.Request) {
    // Limit request size
    r.Body = http.MaxBytesReader(w, r.Body, MaxFileSize)
    
    // Parse multipart form
    if err := r.ParseMultipartForm(MaxFileSize); err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "File too large or invalid form"})
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
    
    // Validate and save file
    fileInfo, err := validateAndSaveFile(file, header)
    if err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": err.Error()})
        return
    }
    
    w.WriteStatus(201)
    w.JSON(fileInfo)
}

// Multiple file upload handler
func multipleUploadHandler(w *squirrel.Response, r *squirrel.Request) {
    // Limit request size
    r.Body = http.MaxBytesReader(w, r.Body, MaxFileSize*5) // 50MB total
    
    // Parse multipart form
    if err := r.ParseMultipartForm(MaxFileSize * 5); err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Request too large or invalid form"})
        return
    }
    
    files := r.MultipartForm.File["files"]
    if len(files) == 0 {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "No files provided"})
        return
    }
    
    var uploadedFiles []*FileInfo
    var errors []string
    
    for _, header := range files {
        file, err := header.Open()
        if err != nil {
            errors = append(errors, fmt.Sprintf("Error opening %s: %v", header.Filename, err))
            continue
        }
        
        fileInfo, err := validateAndSaveFile(file, header)
        file.Close()
        
        if err != nil {
            errors = append(errors, fmt.Sprintf("Error saving %s: %v", header.Filename, err))
            continue
        }
        
        uploadedFiles = append(uploadedFiles, fileInfo)
    }
    
    response := map[string]interface{}{
        "uploaded_files": uploadedFiles,
        "uploaded_count": len(uploadedFiles),
    }
    
    if len(errors) > 0 {
        response["errors"] = errors
    }
    
    w.WriteStatus(201)
    w.JSON(response)
}

// Validate and save file
func validateAndSaveFile(file multipart.File, header *multipart.FileHeader) (*FileInfo, error) {
    // Check file size
    if header.Size > MaxFileSize {
        return nil, fmt.Errorf("file too large: %d bytes (max %d)", header.Size, MaxFileSize)
    }
    
    // Check file extension
    ext := strings.ToLower(filepath.Ext(header.Filename))
    if !allowedExtensions[ext] {
        return nil, fmt.Errorf("file type not allowed: %s", ext)
    }
    
    // Read file content for validation
    buffer := make([]byte, 512)
    _, err := file.Read(buffer)
    if err != nil {
        return nil, fmt.Errorf("error reading file: %v", err)
    }
    
    // Detect content type
    contentType := http.DetectContentType(buffer)
    if !allowedTypes[contentType] {
        return nil, fmt.Errorf("content type not allowed: %s", contentType)
    }
    
    // Reset file pointer
    file.Seek(0, 0)
    
    // Generate unique filename
    timestamp := time.Now().UnixNano()
    filename := fmt.Sprintf("%d_%s", timestamp, header.Filename)
    filepath := filepath.Join(UploadDir, filename)
    
    // Create destination file
    dst, err := os.Create(filepath)
    if err != nil {
        return nil, fmt.Errorf("error creating file: %v", err)
    }
    defer dst.Close()
    
    // Calculate MD5 hash while copying
    hash := md5.New()
    multiWriter := io.MultiWriter(dst, hash)
    
    // Copy file content
    _, err = io.Copy(multiWriter, file)
    if err != nil {
        os.Remove(filepath) // Clean up on error
        return nil, fmt.Errorf("error saving file: %v", err)
    }
    
    // Create file info
    fileInfo := &FileInfo{
        ID:          fmt.Sprintf("%d", timestamp),
        OriginalName: header.Filename,
        Filename:    filename,
        Size:        header.Size,
        ContentType: contentType,
        UploadedAt:  time.Now(),
        MD5Hash:     fmt.Sprintf("%x", hash.Sum(nil)),
    }
    
    return fileInfo, nil
}

// Serve file handler
func serveFileHandler(w *squirrel.Response, r *squirrel.Request) {
    fileID := r.PathValue("id")
    
    // Find file by ID (in production, use a database)
    files, err := filepath.Glob(filepath.Join(UploadDir, fileID+"_*"))
    if err != nil || len(files) == 0 {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "File not found"})
        return
    }
    
    filePath := files[0]
    
    // Get file info
    fileInfo, err := os.Stat(filePath)
    if err != nil {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "File not found"})
        return
    }
    
    // Set appropriate headers
    ext := strings.ToLower(filepath.Ext(filePath))
    switch ext {
    case ".jpg", ".jpeg":
        w.Header().Set("Content-Type", "image/jpeg")
    case ".png":
        w.Header().Set("Content-Type", "image/png")
    case ".gif":
        w.Header().Set("Content-Type", "image/gif")
    case ".pdf":
        w.Header().Set("Content-Type", "application/pdf")
    case ".txt":
        w.Header().Set("Content-Type", "text/plain")
    default:
        w.Header().Set("Content-Type", "application/octet-stream")
    }
    
    w.Header().Set("Content-Length", strconv.FormatInt(fileInfo.Size(), 10))
    w.Header().Set("Cache-Control", "public, max-age=86400") // 1 day
    
    // Serve the file
    squirrel.ServeFile(w, r, filePath)
}

// File info handler
func fileInfoHandler(w *squirrel.Response, r *squirrel.Request) {
    fileID := r.PathValue("id")
    
    // Find file by ID
    files, err := filepath.Glob(filepath.Join(UploadDir, fileID+"_*"))
    if err != nil || len(files) == 0 {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "File not found"})
        return
    }
    
    filePath := files[0]
    fileInfo, err := os.Stat(filePath)
    if err != nil {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "File not found"})
        return
    }
    
    // Extract original filename from stored filename
    filename := filepath.Base(filePath)
    parts := strings.SplitN(filename, "_", 2)
    originalName := filename
    if len(parts) == 2 {
        originalName = parts[1]
    }
    
    response := FileInfo{
        ID:          fileID,
        OriginalName: originalName,
        Filename:    filename,
        Size:        fileInfo.Size(),
        UploadedAt:  fileInfo.ModTime(),
    }
    
    w.JSON(response)
}

// Delete file handler
func deleteFileHandler(w *squirrel.Response, r *squirrel.Request) {
    fileID := r.PathValue("id")
    
    // Find file by ID
    files, err := filepath.Glob(filepath.Join(UploadDir, fileID+"_*"))
    if err != nil || len(files) == 0 {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "File not found"})
        return
    }
    
    // Delete the file
    if err := os.Remove(files[0]); err != nil {
        w.WriteStatus(500)
        w.JSON(map[string]string{"error": "Error deleting file"})
        return
    }
    
    w.WriteStatus(204)
}

// List files handler
func listFilesHandler(w *squirrel.Response, r *squirrel.Request) {
    files, err := filepath.Glob(filepath.Join(UploadDir, "*"))
    if err != nil {
        w.WriteStatus(500)
        w.JSON(map[string]string{"error": "Error listing files"})
        return
    }
    
    var fileList []map[string]interface{}
    
    for _, filePath := range files {
        fileInfo, err := os.Stat(filePath)
        if err != nil {
            continue
        }
        
        filename := filepath.Base(filePath)
        parts := strings.SplitN(filename, "_", 2)
        
        if len(parts) != 2 {
            continue
        }
        
        fileData := map[string]interface{}{
            "id":            parts[0],
            "original_name": parts[1],
            "filename":      filename,
            "size":          fileInfo.Size(),
            "uploaded_at":   fileInfo.ModTime(),
        }
        
        fileList = append(fileList, fileData)
    }
    
    w.JSON(map[string]interface{}{
        "files": fileList,
        "count": len(fileList),
    })
}

// Upload form handler (for testing)
func uploadFormHandler(w *squirrel.Response, r *squirrel.Request) {
    w.Header().Set("Content-Type", "text/html")
    w.WriteString(\`
<!DOCTYPE html>
<html>
<head>
    <title>File Upload Example</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .upload-form { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 5px; }
        input[type="file"] { margin: 10px 0; }
        button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #005a87; }
        .file-list { margin-top: 20px; }
        .file-item { padding: 10px; border: 1px solid #eee; margin: 5px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>File Upload Example</h1>
    
    <div class="upload-form">
        <h3>Single File Upload</h3>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <br>
            <button type="submit">Upload File</button>
        </form>
    </div>
    
    <div class="upload-form">
        <h3>Multiple File Upload</h3>
        <form action="/upload/multiple" method="post" enctype="multipart/form-data">
            <input type="file" name="files" multiple required>
            <br>
            <button type="submit">Upload Files</button>
        </form>
    </div>
    
    <div class="file-list">
        <h3>Uploaded Files</h3>
        <p><a href="/files">View all files (JSON)</a></p>
    </div>
    
    <div>
        <h3>API Endpoints</h3>
        <ul>
            <li>POST /upload - Single file upload</li>
            <li>POST /upload/multiple - Multiple file upload</li>
            <li>GET /files - List all files</li>
            <li>GET /files/{id} - Download file</li>
            <li>GET /files/{id}/info - Get file info</li>
            <li>DELETE /files/{id} - Delete file</li>
        </ul>
    </div>
</body>
</html>
    \`)
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Testing the File Upload</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Web Interface</h4>
              <p className="text-sm text-muted-foreground mb-2">Visit the upload form in your browser:</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>http://localhost:8080/</code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Single File Upload (cURL)</h4>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl -X POST -F &quote;file=@example.jpg&quote; http://localhost:8080/upload</code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Multiple File Upload (cURL)</h4>
              <div className="bg-muted p-2 rounded text-sm">
                <code>
                  curl -X POST -F &quote;files=@file1.jpg&quote; -F &quote;files=@file2.png&quote; http://localhost:8080/upload/multiple
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">List Files</h4>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl http://localhost:8080/files</code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Download File</h4>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl http://localhost:8080/files/1234567890 -o downloaded_file.jpg</code>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">File Validation</h4>
              <ul className="text-sm space-y-1">
                <li>• File size limits (10MB)</li>
                <li>• Content type validation</li>
                <li>• File extension checking</li>
                <li>• MIME type detection</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Security Measures</h4>
              <ul className="text-sm space-y-1">
                <li>• Unique filename generation</li>
                <li>• Directory traversal prevention</li>
                <li>• Request size limiting</li>
                <li>• MD5 hash calculation</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">File Management</h4>
              <ul className="text-sm space-y-1">
                <li>• Organized file storage</li>
                <li>• File metadata tracking</li>
                <li>• Proper error handling</li>
                <li>• Cleanup on errors</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">HTTP Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Proper content types</li>
                <li>• Cache headers</li>
                <li>• CORS support</li>
                <li>• RESTful endpoints</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Production Enhancements</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🚀 Production Recommendations</h4>
            <ul className="text-sm space-y-1">
              <li>• Use cloud storage (AWS S3, Google Cloud Storage)</li>
              <li>• Implement virus scanning</li>
              <li>• Add image resizing/thumbnail generation</li>
              <li>• Use a database for file metadata</li>
              <li>• Implement user authentication</li>
              <li>• Add file access permissions</li>
              <li>• Use CDN for file serving</li>
              <li>• Implement file versioning</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Add image processing and thumbnail generation</li>
            <li>Implement user authentication and file ownership</li>
            <li>Add database integration for file metadata</li>
            <li>Explore cloud storage integration</li>
            <li>
              Learn about{" "}
              <a href="/docs/guides/static-files" className="text-blue-600 hover:underline">
                static file serving
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
