import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Upload, FileText, AlertTriangle } from "lucide-react"

export default function RequestHandlingGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Request Handling Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Master request processing in Squirrel, including parsing forms, handling JSON, working with headers, and file
          uploads.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            JSON
          </Badge>
          <Badge variant="secondary">
            <Upload className="w-3 h-3 mr-1" />
            File Upload
          </Badge>
          <Badge variant="secondary">
            <FileText className="w-3 h-3 mr-1" />
            Form Data
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reading Request Data</CardTitle>
          <CardDescription>Access different types of request data (query params, headers, body)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="query" className="w-full">
            <TabsList>
              <TabsTrigger value="query">Query Parameters</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Request Body</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "strconv"
    "github.com/squirrel-land/squirrel"
)

func searchHandler(w http.ResponseWriter, r *http.Request) {
    // Get query parameters
    query := r.URL.Query()
    
    // Single value
    searchTerm := query.Get("q")
    if searchTerm == "" {
        http.Error(w, "Missing search query", http.StatusBadRequest)
        return
    }
    
    // Multiple values
    categories := query["category"] // []string
    
    // With default value
    pageStr := query.Get("page")
    page := 1
    if pageStr != "" {
        if p, err := strconv.Atoi(pageStr); err == nil {
            page = p
        }
    }
    
    // Limit with validation
    limitStr := query.Get("limit")
    limit := 10 // default
    if limitStr != "" {
        if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
            limit = l
        }
    }
    
    fmt.Fprintf(w, "Search: %s, Page: %d, Limit: %d, Categories: %v", 
        searchTerm, page, limit, categories)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Example: /search?q=golang&category=web&category=api&page=2&limit=20
    mux.HandleFunc("/search", searchHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="headers">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "strings"
    "github.com/squirrel-land/squirrel"
)

func headersHandler(w http.ResponseWriter, r *http.Request) {
    // Get specific headers
    userAgent := r.Header.Get("User-Agent")
    contentType := r.Header.Get("Content-Type")
    authorization := r.Header.Get("Authorization")
    
    // Check if header exists
    if accept := r.Header.Get("Accept"); accept != "" {
        fmt.Printf("Client accepts: %s\\n", accept)
    }
    
    // Get all values for a header (some headers can have multiple values)
    acceptEncodings := r.Header["Accept-Encoding"]
    
    // Custom headers (usually prefixed with X-)
    requestID := r.Header.Get("X-Request-ID")
    
    // Check for specific content types
    isJSON := strings.Contains(contentType, "application/json")
    isForm := strings.Contains(contentType, "application/x-www-form-urlencoded")
    isMultipart := strings.Contains(contentType, "multipart/form-data")
    
    // Extract Bearer token
    var token string
    if authorization != "" && strings.HasPrefix(authorization, "Bearer ") {
        token = strings.TrimPrefix(authorization, "Bearer ")
    }
    
    response := fmt.Sprintf(\`Headers Info:
User-Agent: %s
Content-Type: %s
Is JSON: %t
Is Form: %t
Is Multipart: %t
Token: %s
Accept-Encodings: %v
Request-ID: %s\`, 
        userAgent, contentType, isJSON, isForm, isMultipart, 
        token, acceptEncodings, requestID)
    
    fmt.Fprint(w, response)
}

func main() {
    mux := squirrel.NewSqurlMux()
    mux.HandleFunc("/headers", headersHandler)
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="body">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "io"
    "net/http"
    "github.com/squirrel-land/squirrel"
)

func bodyHandler(w http.ResponseWriter, r *http.Request) {
    // Read raw body
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error reading body", http.StatusBadRequest)
        return
    }
    defer r.Body.Close()
    
    // Get content type
    contentType := r.Header.Get("Content-Type")
    
    fmt.Fprintf(w, "Content-Type: %s\\nBody Length: %d\\nBody: %s", 
        contentType, len(body), string(body))
}

// For large bodies, use streaming
func streamingHandler(w http.ResponseWriter, r *http.Request) {
    // Limit body size (e.g., 10MB)
    r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
    
    // Process body in chunks
    buffer := make([]byte, 1024)
    totalBytes := 0
    
    for {
        n, err := r.Body.Read(buffer)
        if n > 0 {
            totalBytes += n
            // Process chunk here
            fmt.Printf("Processed %d bytes\\n", n)
        }
        if err == io.EOF {
            break
        }
        if err != nil {
            http.Error(w, "Error reading body", http.StatusBadRequest)
            return
        }
    }
    
    fmt.Fprintf(w, "Processed %d total bytes", totalBytes)
}`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Request Handling</CardTitle>
          <CardDescription>Parse and validate JSON request bodies</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
    "github.com/squirrel-land/squirrel"
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name" validate:"required,min=2,max=50"\`
    Email string \`json:"email" validate:"required,email"\`
    Age   int    \`json:"age" validate:"min=18,max=120"\`
}

type ErrorResponse struct {
    Error   string            \`json:"error"\`
    Details map[string]string \`json:"details,omitempty"\`
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
    // Ensure content type is JSON
    if !strings.Contains(r.Header.Get("Content-Type"), "application/json") {
        writeErrorResponse(w, "Content-Type must be application/json", http.StatusBadRequest)
        return
    }
    
    // Limit request body size (1MB)
    r.Body = http.MaxBytesReader(w, r.Body, 1048576)
    
    var user User
    decoder := json.NewDecoder(r.Body)
    decoder.DisallowUnknownFields() // Reject unknown fields
    
    if err := decoder.Decode(&user); err != nil {
        var errorMsg string
        switch {
        case strings.Contains(err.Error(), "unknown field"):
            errorMsg = "Unknown field in JSON"
        case strings.Contains(err.Error(), "invalid character"):
            errorMsg = "Invalid JSON format"
        default:
            errorMsg = "Error parsing JSON"
        }
        writeErrorResponse(w, errorMsg, http.StatusBadRequest)
        return
    }
    
    // Validate required fields
    if user.Name == "" {
        writeErrorResponse(w, "Name is required", http.StatusBadRequest)
        return
    }
    
    if user.Email == "" {
        writeErrorResponse(w, "Email is required", http.StatusBadRequest)
        return
    }
    
    // Basic email validation
    if !strings.Contains(user.Email, "@") {
        writeErrorResponse(w, "Invalid email format", http.StatusBadRequest)
        return
    }
    
    // Age validation
    if user.Age < 18 || user.Age > 120 {
        writeErrorResponse(w, "Age must be between 18 and 120", http.StatusBadRequest)
        return
    }
    
    // Simulate saving user (assign ID)
    user.ID = 123
    
    // Return created user
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func writeErrorResponse(w http.ResponseWriter, message string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

// Batch processing example
func batchCreateUsersHandler(w http.ResponseWriter, r *http.Request) {
    var users []User
    
    if err := json.NewDecoder(r.Body).Decode(&users); err != nil {
        writeErrorResponse(w, "Invalid JSON array", http.StatusBadRequest)
        return
    }
    
    if len(users) == 0 {
        writeErrorResponse(w, "Empty user array", http.StatusBadRequest)
        return
    }
    
    if len(users) > 100 {
        writeErrorResponse(w, "Too many users (max 100)", http.StatusBadRequest)
        return
    }
    
    // Process each user
    var createdUsers []User
    var errors []string
    
    for i, user := range users {
        if user.Name == "" || user.Email == "" {
            errors = append(errors, fmt.Sprintf("User %d: missing required fields", i))
            continue
        }
        
        user.ID = 1000 + i // Assign ID
        createdUsers = append(createdUsers, user)
    }
    
    response := map[string]interface{}{
        "created": createdUsers,
        "errors":  errors,
        "total":   len(users),
        "success": len(createdUsers),
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Post("/users", createUserHandler)
    mux.Post("/users/batch", batchCreateUsersHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Data Handling</CardTitle>
          <CardDescription>Process HTML forms and URL-encoded data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList>
              <TabsTrigger value="simple">Simple Forms</TabsTrigger>
              <TabsTrigger value="validation">Form Validation</TabsTrigger>
            </TabsList>
            <TabsContent value="simple">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "strconv"
    "github.com/squirrel-land/squirrel"
)

func contactFormHandler(w http.ResponseWriter, r *http.Request) {
    // Parse form data
    if err := r.ParseForm(); err != nil {
        http.Error(w, "Error parsing form", http.StatusBadRequest)
        return
    }
    
    // Get form values
    name := r.FormValue("name")
    email := r.FormValue("email")
    message := r.FormValue("message")
    
    // Get multiple values (checkboxes, multiple selects)
    interests := r.Form["interests"] // []string
    
    // Get with default value
    newsletter := r.FormValue("newsletter") == "on"
    
    // Convert string to int
    ageStr := r.FormValue("age")
    age := 0
    if ageStr != "" {
        if a, err := strconv.Atoi(ageStr); err == nil {
            age = a
        }
    }
    
    response := fmt.Sprintf(\`Form Data Received:
Name: %s
Email: %s
Age: %d
Message: %s
Newsletter: %t
Interests: %v\`, name, email, age, message, newsletter, interests)
    
    fmt.Fprint(w, response)
}

// Handle both GET (show form) and POST (process form)
func userFormHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        // Show HTML form
        html := \`<!DOCTYPE html>
<html>
<head><title>User Form</title></head>
<body>
    <form method="POST">
        <label>Name: <input type="text" name="name" required></label><br>
        <label>Email: <input type="email" name="email" required></label><br>
        <label>Age: <input type="number" name="age" min="18"></label><br>
        <label>Message: <textarea name="message"></textarea></label><br>
        <label><input type="checkbox" name="newsletter"> Subscribe to newsletter</label><br>
        <label>Interests:</label><br>
        <label><input type="checkbox" name="interests" value="web"> Web Development</label><br>
        <label><input type="checkbox" name="interests" value="mobile"> Mobile Development</label><br>
        <label><input type="checkbox" name="interests" value="ai"> AI/ML</label><br>
        <button type="submit">Submit</button>
    </form>
</body>
</html>\`
        w.Header().Set("Content-Type", "text/html")
        fmt.Fprint(w, html)
        
    case http.MethodPost:
        contactFormHandler(w, r)
        
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.HandleFunc("/contact", contactFormHandler)
    mux.HandleFunc("/form", userFormHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
            <TabsContent value="validation">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`package main

import (
    "fmt"
    "net/http"
    "regexp"
    "strconv"
    "strings"
    "github.com/squirrel-land/squirrel"
)

type FormErrors map[string]string

func (fe FormErrors) HasErrors() bool {
    return len(fe) > 0
}

func (fe FormErrors) Add(field, message string) {
    fe[field] = message
}

func validateContactForm(r *http.Request) FormErrors {
    errors := make(FormErrors)
    
    // Required field validation
    name := strings.TrimSpace(r.FormValue("name"))
    if name == "" {
        errors.Add("name", "Name is required")
    } else if len(name) < 2 {
        errors.Add("name", "Name must be at least 2 characters")
    } else if len(name) > 50 {
        errors.Add("name", "Name must be less than 50 characters")
    }
    
    // Email validation
    email := strings.TrimSpace(r.FormValue("email"))
    if email == "" {
        errors.Add("email", "Email is required")
    } else {
        emailRegex := regexp.MustCompile(\`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`)
        if !emailRegex.MatchString(email) {
            errors.Add("email", "Invalid email format")
        }
    }
    
    // Age validation
    ageStr := r.FormValue("age")
    if ageStr != "" {
        age, err := strconv.Atoi(ageStr)
        if err != nil {
            errors.Add("age", "Age must be a number")
        } else if age < 18 {
            errors.Add("age", "Must be at least 18 years old")
        } else if age > 120 {
            errors.Add("age", "Age must be realistic")
        }
    }
    
    // Message validation
    message := strings.TrimSpace(r.FormValue("message"))
    if message == "" {
        errors.Add("message", "Message is required")
    } else if len(message) < 10 {
        errors.Add("message", "Message must be at least 10 characters")
    } else if len(message) > 1000 {
        errors.Add("message", "Message must be less than 1000 characters")
    }
    
    // Phone validation (optional field)
    phone := strings.TrimSpace(r.FormValue("phone"))
    if phone != "" {
        phoneRegex := regexp.MustCompile(\`^\\+?[1-9]\\d{1,14}$\`)
        if !phoneRegex.MatchString(phone) {
            errors.Add("phone", "Invalid phone number format")
        }
    }
    
    return errors
}

func validatedContactHandler(w http.ResponseWriter, r *http.Request) {
    if err := r.ParseForm(); err != nil {
        http.Error(w, "Error parsing form", http.StatusBadRequest)
        return
    }
    
    // Validate form
    errors := validateContactForm(r)
    
    if errors.HasErrors() {
        // Return validation errors
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        
        response := map[string]interface{}{
            "success": false,
            "errors":  errors,
        }
        
        json.NewEncoder(w).Encode(response)
        return
    }
    
    // Process valid form
    name := r.FormValue("name")
    email := r.FormValue("email")
    message := r.FormValue("message")
    
    // Here you would typically save to database, send email, etc.
    fmt.Printf("Processing contact form: %s <%s>: %s\\n", name, email, message)
    
    // Return success response
    w.Header().Set("Content-Type", "application/json")
    response := map[string]interface{}{
        "success": true,
        "message": "Thank you for your message! We'll get back to you soon.",
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    mux := squirrel.NewSqurlMux()
    mux.Post("/contact", validatedContactHandler)
    http.ListenAndServe(":8080", mux)
}`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload Handling</CardTitle>
          <CardDescription>Handle single and multiple file uploads with validation</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
    "strings"
    "github.com/squirrel-land/squirrel"
)

const (
    MaxFileSize = 10 << 20 // 10MB
    UploadDir   = "./uploads"
)

func init() {
    // Create upload directory if it doesn't exist
    os.MkdirAll(UploadDir, 0755)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    // Limit request size
    r.Body = http.MaxBytesReader(w, r.Body, MaxFileSize)
    
    // Parse multipart form
    if err := r.ParseMultipartForm(MaxFileSize); err != nil {
        http.Error(w, "File too large", http.StatusBadRequest)
        return
    }
    
    // Get file from form
    file, header, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Error retrieving file", http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    // Validate file
    if err := validateFile(header); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    // Create unique filename
    filename := generateUniqueFilename(header.Filename)
    filepath := filepath.Join(UploadDir, filename)
    
    // Create destination file
    dst, err := os.Create(filepath)
    if err != nil {
        http.Error(w, "Error creating file", http.StatusInternalServerError)
        return
    }
    defer dst.Close()
    
    // Copy file content
    if _, err := io.Copy(dst, file); err != nil {
        http.Error(w, "Error saving file", http.StatusInternalServerError)
        return
    }
    
    // Return success response
    response := map[string]interface{}{
        "success":  true,
        "filename": filename,
        "size":     header.Size,
        "message":  "File uploaded successfully",
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func validateFile(header *multipart.FileHeader) error {
    // Check file size
    if header.Size > MaxFileSize {
        return fmt.Errorf("file too large (max %d bytes)", MaxFileSize)
    }
    
    if header.Size == 0 {
        return fmt.Errorf("empty file")
    }
    
    // Check file extension
    allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".pdf", ".txt", ".doc", ".docx"}
    ext := strings.ToLower(filepath.Ext(header.Filename))
    
    allowed := false
    for _, allowedExt := range allowedExts {
        if ext == allowedExt {
            allowed = true
            break
        }
    }
    
    if !allowed {
        return fmt.Errorf("file type not allowed: %s", ext)
    }
    
    return nil
}

func generateUniqueFilename(originalName string) string {
    ext := filepath.Ext(originalName)
    name := strings.TrimSuffix(originalName, ext)
    
    // Clean filename
    name = strings.ReplaceAll(name, " ", "_")
    name = regexp.MustCompile(\`[^a-zA-Z0-9_-]\`).ReplaceAllString(name, "")
    
    // Add timestamp for uniqueness
    timestamp := time.Now().Unix()
    return fmt.Sprintf("%s_%d%s", name, timestamp, ext)
}

// Multiple file upload
func multipleUploadHandler(w http.ResponseWriter, r *http.Request) {
    r.Body = http.MaxBytesReader(w, r.Body, MaxFileSize*5) // Allow up to 5 files
    
    if err := r.ParseMultipartForm(MaxFileSize * 5); err != nil {
        http.Error(w, "Request too large", http.StatusBadRequest)
        return
    }
    
    files := r.MultipartForm.File["files"]
    if len(files) == 0 {
        http.Error(w, "No files provided", http.StatusBadRequest)
        return
    }
    
    if len(files) > 5 {
        http.Error(w, "Too many files (max 5)", http.StatusBadRequest)
        return
    }
    
    var uploadedFiles []map[string]interface{}
    var errors []string
    
    for i, fileHeader := range files {
        file, err := fileHeader.Open()
        if err != nil {
            errors = append(errors, fmt.Sprintf("File %d: error opening file", i))
            continue
        }
        
        if err := validateFile(fileHeader); err != nil {
            errors = append(errors, fmt.Sprintf("File %d: %s", i, err.Error()))
            file.Close()
            continue
        }
        
        filename := generateUniqueFilename(fileHeader.Filename)
        filepath := filepath.Join(UploadDir, filename)
        
        dst, err := os.Create(filepath)
        if err != nil {
            errors = append(errors, fmt.Sprintf("File %d: error creating file", i))
            file.Close()
            continue
        }
        
        if _, err := io.Copy(dst, file); err != nil {
            errors = append(errors, fmt.Sprintf("File %d: error saving file", i))
            dst.Close()
            file.Close()
            continue
        }
        
        uploadedFiles = append(uploadedFiles, map[string]interface{}{
            "original": fileHeader.Filename,
            "filename": filename,
            "size":     fileHeader.Size,
        })
        
        dst.Close()
        file.Close()
    }
    
    response := map[string]interface{}{
        "success":       len(uploadedFiles) > 0,
        "uploaded":      uploadedFiles,
        "errors":        errors,
        "total_files":   len(files),
        "success_count": len(uploadedFiles),
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Post("/upload", uploadHandler)
    mux.Post("/upload/multiple", multipleUploadHandler)
    
    // Serve uploaded files
    mux.HandleFunc("/files/", http.StripPrefix("/files/", 
        http.FileServer(http.Dir(UploadDir))).ServeHTTP)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Always validate file types, sizes, and content. Never trust user input.
          Consider using virus scanning for uploaded files in production environments.
        </AlertDescription>
      </Alert>
    </div>
  )
}
