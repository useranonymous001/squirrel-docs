import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Code } from "lucide-react"

export default function ErrorHandlingGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Error Handling Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Implement robust error handling strategies, create user-friendly error pages, and build resilient Squirrel
          applications.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Custom Errors
          </Badge>
          <Badge variant="secondary">
            <Shield className="w-3 h-3 mr-1" />
            Recovery
          </Badge>
          <Badge variant="secondary">
            <Code className="w-3 h-3 mr-1" />
            Logging
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Error Handling</CardTitle>
          <CardDescription>Handle common errors and return appropriate HTTP responses</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "strings"
    "github.com/squirrel-land/squirrel"
)

type ErrorResponse struct {
    Error   string \`json:"error"\`
    Code    string \`json:"code,omitempty"\`
    Details string \`json:"details,omitempty"\`
}

// Error response helpers
func sendError(w http.ResponseWriter, message string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    
    response := ErrorResponse{Error: message}
    json.NewEncoder(w).Encode(response)
}

func sendDetailedError(w http.ResponseWriter, message, code, details string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    
    response := ErrorResponse{
        Error:   message,
        Code:    code,
        Details: details,
    }
    json.NewEncoder(w).Encode(response)
}

// Example handlers with error handling
func getUserHandler(w http.ResponseWriter, r *http.Request) {
    idStr := squirrel.GetParam(r, "id")
    
    // Validate ID parameter
    id, err := strconv.Atoi(idStr)
    if err != nil {
        sendDetailedError(w, "Invalid user ID", "INVALID_ID", 
            "User ID must be a valid integer", http.StatusBadRequest)
        return
    }
    
    if id <= 0 {
        sendDetailedError(w, "Invalid user ID", "INVALID_ID", 
            "User ID must be positive", http.StatusBadRequest)
        return
    }
    
    // Simulate database lookup
    user, err := findUserByID(id)
    if err != nil {
        if err == ErrUserNotFound {
            sendError(w, "User not found", http.StatusNotFound)
            return
        }
        
        // Log internal error but don't expose details
        fmt.Printf("Database error: %v\\n", err)
        sendError(w, "Internal server error", http.StatusInternalServerError)
        return
    }
    
    // Success response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// Custom error types
var (
    ErrUserNotFound     = fmt.Errorf("user not found")
    ErrInvalidEmail     = fmt.Errorf("invalid email format")
    ErrDuplicateEmail   = fmt.Errorf("email already exists")
    ErrInsufficientAuth = fmt.Errorf("insufficient authentication")
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

// Simulate database operations
func findUserByID(id int) (*User, error) {
    // Simulate different error conditions
    switch id {
    case 999:
        return nil, ErrUserNotFound
    case 500:
        return nil, fmt.Errorf("database connection failed")
    default:
        return &User{
            ID:    id,
            Name:  fmt.Sprintf("User %d", id),
            Email: fmt.Sprintf("user%d@example.com", id),
        }, nil
    }
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    
    // Parse JSON with error handling
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        sendDetailedError(w, "Invalid JSON", "INVALID_JSON", 
            err.Error(), http.StatusBadRequest)
        return
    }
    
    // Validate user data
    if err := validateUser(&user); err != nil {
        switch err {
        case ErrInvalidEmail:
            sendError(w, "Invalid email format", http.StatusBadRequest)
        case ErrDuplicateEmail:
            sendError(w, "Email already exists", http.StatusConflict)
        default:
            sendError(w, err.Error(), http.StatusBadRequest)
        }
        return
    }
    
    // Simulate user creation
    user.ID = 123
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func validateUser(user *User) error {
    if user.Name == "" {
        return fmt.Errorf("name is required")
    }
    
    if user.Email == "" {
        return fmt.Errorf("email is required")
    }
    
    // Simple email validation
    if !strings.Contains(user.Email, "@") {
        return ErrInvalidEmail
    }
    
    // Simulate duplicate check
    if user.Email == "duplicate@example.com" {
        return ErrDuplicateEmail
    }
    
    return nil
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/users/{id}", getUserHandler)
    mux.Post("/users", createUserHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Panic Recovery Middleware</CardTitle>
          <CardDescription>Catch panics and convert them to proper error responses</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "runtime/debug"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Recovery middleware with logging
func recoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                // Log the panic with stack trace
                log.Printf("Panic recovered: %v\\n%s", err, debug.Stack())
                
                // Send error response
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusInternalServerError)
                
                response := map[string]string{
                    "error": "Internal server error",
                }
                json.NewEncoder(w).Encode(response)
            }
        }()
        
        next.ServeHTTP(w, r)
    })
}

// Advanced recovery with custom error handling
type RecoveryConfig struct {
    LogFunc      func(interface{}, []byte)
    ResponseFunc func(http.ResponseWriter, *http.Request, interface{})
    StackTrace   bool
}

func recoveryWithConfig(config RecoveryConfig) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            defer func() {
                if err := recover(); err != nil {
                    var stack []byte
                    if config.StackTrace {
                        stack = debug.Stack()
                    }
                    
                    // Custom logging
                    if config.LogFunc != nil {
                        config.LogFunc(err, stack)
                    } else {
                        log.Printf("Panic: %v", err)
                    }
                    
                    // Custom response
                    if config.ResponseFunc != nil {
                        config.ResponseFunc(w, r, err)
                    } else {
                        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
                    }
                }
            }()
            
            next.ServeHTTP(w, r)
        })
    }
}

// Custom panic logger
func customPanicLogger(err interface{}, stack []byte) {
    log.Printf("=== PANIC RECOVERED ===")
    log.Printf("Time: %s", time.Now().Format(time.RFC3339))
    log.Printf("Error: %v", err)
    if stack != nil {
        log.Printf("Stack Trace:\\n%s", stack)
    }
    log.Printf("=====================")
}

// Custom panic response
func customPanicResponse(w http.ResponseWriter, r *http.Request, err interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusInternalServerError)
    
    response := map[string]interface{}{
        "error":     "Internal server error",
        "requestId": r.Header.Get("X-Request-ID"),
        "timestamp": time.Now().Format(time.RFC3339),
    }
    json.NewEncoder(w).Encode(response)
}

// Example usage
func main() {
    mux := squirrel.NewSqurlMux()
    
    // Basic recovery
    mux.Use(recoveryMiddleware)
    
    // Or advanced recovery
    mux.Use(recoveryWithConfig(RecoveryConfig{
        LogFunc:      customPanicLogger,
        ResponseFunc: customPanicResponse,
        StackTrace:   true,
    }))
    
    // Handler that might panic
    mux.Get("/risky", func(w http.ResponseWriter, r *http.Request) {
        // Simulate a panic
        if r.URL.Query().Get("panic") == "true" {
            panic("Something went terribly wrong!")
        }
        
        w.Write([]byte("Everything is fine"))
    })
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Structured Error Types</CardTitle>
          <CardDescription>Create custom error types for better error handling</CardDescription>
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

// AppError represents a structured application error
type AppError struct {
    Code       string                 \`json:"code"\`
    Message    string                 \`json:"message"\`
    StatusCode int                    \`json:"-"\`
    Details    map[string]interface{} \`json:"details,omitempty"\`
    Err        error                  \`json:"-"\`
}

// Error implements the error interface
func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Err)
    }
    return e.Message
}

// Unwrap returns the wrapped error
func (e *AppError) Unwrap() error {
    return e.Err
}

// WithDetails adds details to the error
func (e *AppError) WithDetails(details map[string]interface{}) *AppError {
    e.Details = details
    return e
}

// WithError wraps another error
func (e *AppError) WithError(err error) *AppError {
    e.Err = err
    return e
}

// Predefined error types
var (
    ErrNotFound = &AppError{
        Code:       "NOT_FOUND",
        Message:    "Resource not found",
        StatusCode: http.StatusNotFound,
    }
    
    ErrBadRequest = &AppError{
        Code:       "BAD_REQUEST",
        Message:    "Invalid request",
        StatusCode: http.StatusBadRequest,
    }
    
    ErrUnauthorized = &AppError{
        Code:       "UNAUTHORIZED",
        Message:    "Unauthorized access",
        StatusCode: http.StatusUnauthorized,
    }
    
    ErrForbidden = &AppError{
        Code:       "FORBIDDEN",
        Message:    "Access forbidden",
        StatusCode: http.StatusForbidden,
    }
    
    ErrInternal = &AppError{
        Code:       "INTERNAL_ERROR",
        Message:    "Internal server error",
        StatusCode: http.StatusInternalServerError,
    }
)

// Error handler middleware
func errorHandlerMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Create a custom response writer to capture status code
        rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
        
        // Call the next handler
        var appErr *AppError
        
        // Use defer to catch panics and handle errors
        defer func() {
            if err := recover(); err != nil {
                // Convert panic to AppError
                switch e := err.(type) {
                case *AppError:
                    appErr = e
                case error:
                    appErr = ErrInternal.WithError(e)
                default:
                    appErr = ErrInternal.WithError(fmt.Errorf("%v", e))
                }
            }
            
            // If we have an AppError, send a structured response
            if appErr != nil {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(appErr.StatusCode)
                
                response := map[string]interface{}{
                    "error":  appErr.Message,
                    "code":   appErr.Code,
                    "status": appErr.StatusCode,
                }
                
                if appErr.Details != nil {
                    response["details"] = appErr.Details
                }
                
                json.NewEncoder(w).Encode(response)
            }
        }()
        
        next.ServeHTTP(rw, r)
    })
}

// Custom response writer to capture status code
type responseWriter struct {
    http.ResponseWriter
    statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

// Example handler using structured errors
func getUserHandler(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    
    if id == "" {
        panic(ErrBadRequest.WithDetails(map[string]interface{}{
            "reason": "Missing id parameter",
        }))
    }
    
    if id == "999" {
        panic(ErrNotFound.WithDetails(map[string]interface{}{
            "id": id,
        }))
    }
    
    if id == "admin" {
        panic(ErrForbidden.WithDetails(map[string]interface{}{
            "id": id,
            "reason": "Admin user cannot be accessed via API",
        }))
    }
    
    // Success response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "id":   id,
        "name": "Example User",
    })
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Apply error handler middleware
    mux.Use(errorHandlerMiddleware)
    
    mux.Get("/users", getUserHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validation Errors</CardTitle>
          <CardDescription>Handle validation errors with detailed feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "regexp"
    "strings"
    "github.com/squirrel-land/squirrel"
)

// ValidationError represents a field validation error
type ValidationError struct {
    Field   string \`json:"field"\`
    Message string \`json:"message"\`
    Value   string \`json:"value,omitempty"\`
}

// ValidationErrors represents multiple validation errors
type ValidationErrors struct {
    Errors []ValidationError \`json:"errors"\`
}

// Error implements the error interface
func (v ValidationErrors) Error() string {
    if len(v.Errors) == 0 {
        return "no validation errors"
    }
    
    messages := make([]string, len(v.Errors))
    for i, err := range v.Errors {
        messages[i] = fmt.Sprintf("%s: %s", err.Field, err.Message)
    }
    
    return strings.Join(messages, "; ")
}

// Add adds a validation error
func (v *ValidationErrors) Add(field, message string, value ...string) {
    err := ValidationError{
        Field:   field,
        Message: message,
    }
    
    if len(value) > 0 {
        err.Value = value[0]
    }
    
    v.Errors = append(v.Errors, err)
}

// HasErrors returns true if there are validation errors
func (v ValidationErrors) HasErrors() bool {
    return len(v.Errors) > 0
}

// User represents a user entity
type User struct {
    ID       int    \`json:"id,omitempty"\`
    Username string \`json:"username"\`
    Email    string \`json:"email"\`
    Password string \`json:"password,omitempty"\`
    Age      int    \`json:"age"\`
}

// Validate validates the user data
func (u *User) Validate() ValidationErrors {
    var v ValidationErrors
    
    // Username validation
    if u.Username == "" {
        v.Add("username", "Username is required")
    } else if len(u.Username) < 3 {
        v.Add("username", "Username must be at least 3 characters", u.Username)
    } else if len(u.Username) > 50 {
        v.Add("username", "Username must be at most 50 characters", u.Username)
    }
    
    // Email validation
    emailRegex := regexp.MustCompile(\`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$\`)
    if u.Email == "" {
        v.Add("email", "Email is required")
    } else if !emailRegex.MatchString(u.Email) {
        v.Add("email", "Invalid email format", u.Email)
    }
    
    // Password validation
    if u.Password == "" {
        v.Add("password", "Password is required")
    } else if len(u.Password) < 8 {
        v.Add("password", "Password must be at least 8 characters")
    }
    
    // Age validation
    if u.Age < 18 {
        v.Add("age", "Age must be at least 18", fmt.Sprintf("%d", u.Age))
    } else if u.Age > 120 {
        v.Add("age", "Age must be at most 120", fmt.Sprintf("%d", u.Age))
    }
    
    return v
}

// Create user handler with validation
func createUserHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    
    // Parse JSON
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Invalid JSON: " + err.Error(),
        })
        return
    }
    
    // Validate user
    validationErrors := user.Validate()
    if validationErrors.HasErrors() {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "error":  "Validation failed",
            "code":   "VALIDATION_ERROR",
            "errors": validationErrors.Errors,
        })
        return
    }
    
    // Create user (simulated)
    user.ID = 123
    user.Password = "" // Don't return password
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func main() {
    mux := squirrel.NewSqurlMux()
    
    mux.Post("/users", createUserHandler)
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Circuit Breaker Pattern</CardTitle>
          <CardDescription>Implement circuit breaker for external services</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "errors"
    "fmt"
    "log"
    "net/http"
    "sync"
    "time"
    "github.com/squirrel-land/squirrel"
)

// CircuitBreaker implements the circuit breaker pattern
type CircuitBreaker struct {
    name          string
    maxFailures   int
    timeout       time.Duration
    failures      int
    lastFailure   time.Time
    state         string // "closed", "open", "half-open"
    mutex         sync.Mutex
    onStateChange func(string, string)
}

// NewCircuitBreaker creates a new circuit breaker
func NewCircuitBreaker(name string, maxFailures int, timeout time.Duration) *CircuitBreaker {
    return &CircuitBreaker{
        name:        name,
        maxFailures: maxFailures,
        timeout:     timeout,
        state:       "closed",
    }
}

// OnStateChange sets a callback for state changes
func (cb *CircuitBreaker) OnStateChange(fn func(oldState, newState string)) {
    cb.onStateChange = fn
}

// setState changes the state and triggers the callback
func (cb *CircuitBreaker) setState(newState string) {
    if cb.state == newState {
        return
    }
    
    oldState := cb.state
    cb.state = newState
    
    if cb.onStateChange != nil {
        cb.onStateChange(oldState, newState)
    }
}

// Execute executes a function with circuit breaker protection
func (cb *CircuitBreaker) Execute(fn func() error) error {
    cb.mutex.Lock()
    
    // Check if circuit should be half-open
    if cb.state == "open" && time.Since(cb.lastFailure) > cb.timeout {
        cb.setState("half-open")
    }
    
    // Reject if circuit is open
    if cb.state == "open" {
        cb.mutex.Unlock()
        return fmt.Errorf("circuit breaker '%s' is open", cb.name)
    }
    
    // Only allow one request in half-open state
    isHalfOpen := cb.state == "half-open"
    cb.mutex.Unlock()
    
    // Execute function
    err := fn()
    
    cb.mutex.Lock()
    defer cb.mutex.Unlock()
    
    if err != nil {
        cb.failures++
        cb.lastFailure = time.Now()
        
        // In half-open state, any failure trips the circuit again
        if isHalfOpen || cb.failures >= cb.maxFailures {
            cb.setState("open")
        }
        
        return err
    }
    
    // Reset on success
    if isHalfOpen {
        cb.setState("closed")
    }
    cb.failures = 0
    
    return nil
}

// State returns the current state
func (cb *CircuitBreaker) State() string {
    cb.mutex.Lock()
    defer cb.mutex.Unlock()
    return cb.state
}

// ExternalServiceClient simulates an external service client
type ExternalServiceClient struct {
    baseURL       string
    circuitBreaker *CircuitBreaker
}

// NewExternalServiceClient creates a new external service client
func NewExternalServiceClient(baseURL string) *ExternalServiceClient {
    cb := NewCircuitBreaker("external-service", 3, 30*time.Second)
    
    // Log state changes
    cb.OnStateChange(func(oldState, newState string) {
        log.Printf("Circuit breaker state changed from %s to %s", oldState, newState)
    })
    
    return &ExternalServiceClient{
        baseURL:       baseURL,
        circuitBreaker: cb,
    }
}

// GetData gets data from the external service
func (c *ExternalServiceClient) GetData(id string) (map[string]interface{}, error) {
    var result map[string]interface{}
    
    err := c.circuitBreaker.Execute(func() error {
        // Simulate external service call
        if id == "fail" {
            return errors.New("external service error")
        }
        
        // Simulate successful response
        result = map[string]interface{}{
            "id":   id,
            "name": "External Data",
            "timestamp": time.Now().Format(time.RFC3339),
        }
        
        return nil
    })
    
    if err != nil {
        return nil, err
    }
    
    return result, nil
}

// Handler using circuit breaker
func externalDataHandler(client *ExternalServiceClient) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Query().Get("id")
        if id == "" {
            http.Error(w, "Missing id parameter", http.StatusBadRequest)
            return
        }
        
        data, err := client.GetData(id)
        if err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusServiceUnavailable)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Service temporarily unavailable",
                "state": client.circuitBreaker.State(),
            })
            return
        }
        
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(data)
    }
}

// Circuit breaker status handler
func circuitBreakerStatusHandler(client *ExternalServiceClient) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]string{
            "state": client.circuitBreaker.State(),
        })
    }
}

func main() {
    client := NewExternalServiceClient("https://api.example.com")
    
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/data", externalDataHandler(client))
    mux.Get("/circuit-status", circuitBreakerStatusHandler(client))
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Graceful Degradation</CardTitle>
          <CardDescription>Implement fallback mechanisms for resilient services</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`package main

import (
    "encoding/json"
    "errors"
    "fmt"
    "log"
    "net/http"
    "sync"
    "time"
    "github.com/squirrel-land/squirrel"
)

// Product represents a product entity
type Product struct {
    ID          string    \`json:"id"\`
    Name        string    \`json:"name"\`
    Price       float64   \`json:"price"\`
    Description string    \`json:"description,omitempty"\`
    ImageURL    string    \`json:"image_url,omitempty"\`
    UpdatedAt   time.Time \`json:"updated_at"\`
    Source      string    \`json:"source,omitempty"\` // For tracking the data source
}

// ProductService defines the interface for product operations
type ProductService interface {
    GetProduct(id string) (*Product, error)
}

// PrimaryProductService is the main product service
type PrimaryProductService struct {
    // In a real app, this would have a database connection
}

// GetProduct gets a product from the primary database
func (s *PrimaryProductService) GetProduct(id string) (*Product, error) {
    // Simulate database lookup
    if id == "error" {
        return nil, errors.New("database error")
    }
    
    if id == "timeout" {
        time.Sleep(2 * time.Second) // Simulate timeout
        return nil, errors.New("database timeout")
    }
    
    if id == "notfound" {
        return nil, nil
    }
    
    return &Product{
        ID:          id,
        Name:        "Product from Primary DB",
        Price:       99.99,
        Description: "Full product description",
        ImageURL:    "https://example.com/images/product.jpg",
        UpdatedAt:   time.Now(),
        Source:      "primary",
    }, nil
}

// CacheProductService is a cache-based product service
type CacheProductService struct {
    cache map[string]*Product
    mu    sync.RWMutex
}

// NewCacheProductService creates a new cache service
func NewCacheProductService() *CacheProductService {
    return &CacheProductService{
        cache: make(map[string]*Product),
    }
}

// GetProduct gets a product from the cache
func (s *CacheProductService) GetProduct(id string) (*Product, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    
    product, found := s.cache[id]
    if !found {
        return nil, nil
    }
    
    // Clone to avoid cache modification
    clone := *product
    clone.Source = "cache"
    return &clone, nil
}

// SetProduct sets a product in the cache
func (s *CacheProductService) SetProduct(product *Product) {
    s.mu.Lock()
    defer s.mu.Unlock()
    
    clone := *product
    s.cache[product.ID] = &clone
}

// FallbackProductService is a fallback product service
type FallbackProductService struct {
    // In a real app, this might be a read-only replica
}

// GetProduct gets a product from the fallback service
func (s *FallbackProductService) GetProduct(id string) (*Product, error) {
    // Simulate fallback lookup
    if id == "error" || id == "timeout" {
        return nil, errors.New("fallback error")
    }
    
    if id == "notfound" {
        return nil, nil
    }
    
    return &Product{
        ID:        id,
        Name:      "Product from Fallback",
        Price:     99.99,
        UpdatedAt: time.Now().Add(-24 * time.Hour), // Older data
        Source:    "fallback",
    }, nil
}

// ProductHandler handles product requests with graceful degradation
func ProductHandler(primary, cache, fallback ProductService) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Query().Get("id")
        if id == "" {
            http.Error(w, "Missing id parameter", http.StatusBadRequest)
            return
        }
        
        var product *Product
        var err error
        var source string
        
        // Try primary service
        product, err = primary.GetProduct(id)
        if err == nil && product != nil {
            source = "primary"
            
            // Update cache in background
            if cache != nil {
                go func(p *Product) {
                    cache.(*CacheProductService).SetProduct(p)
                }(product)
            }
        } else if err != nil {
            log.Printf("Primary service error: %v", err)
            
            // Try cache
            if cache != nil {
                product, err = cache.GetProduct(id)
                if err == nil && product != nil {
                    source = "cache"
                } else if err != nil {
                    log.Printf("Cache service error: %v", err)
                }
            }
            
            // Try fallback
            if (product == nil || err != nil) && fallback != nil {
                product, err = fallback.GetProduct(id)
                if err == nil && product != nil {
                    source = "fallback"
                } else if err != nil {
                    log.Printf("Fallback service error: %v", err)
                }
            }
        }
        
        // Handle not found
        if product == nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusNotFound)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Product not found",
            })
            return
        }
        
        // Set source header
        w.Header().Set("X-Data-Source", source)
        
        // Return product
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(product)
    }
}

func main() {
    primary := &PrimaryProductService{}
    cache := NewCacheProductService()
    fallback := &FallbackProductService{}
    
    mux := squirrel.NewSqurlMux()
    
    mux.Get("/products", ProductHandler(primary, cache, fallback))
    
    http.ListenAndServe(":8080", mux)
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>Error handling best practices for Squirrel applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">1. Use Structured Error Types</h3>
            <p>
              Create custom error types with fields for error code, message, and details to provide consistent error
              responses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Implement Recovery Middleware</h3>
            <p>Always use recovery middleware to catch panics and convert them to proper error responses.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Log Errors Appropriately</h3>
            <p>Log detailed error information for debugging but avoid exposing sensitive details in API responses.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. Use Appropriate Status Codes</h3>
            <p>Return appropriate HTTP status codes that accurately reflect the error condition.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">5. Implement Graceful Degradation</h3>
            <p>Use fallback mechanisms and circuit breakers to handle failures in external dependencies.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">6. Validate Input Early</h3>
            <p>Validate user input as early as possible and return detailed validation errors.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">7. Include Request IDs</h3>
            <p>Include request IDs in error responses to help correlate errors with log entries.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">8. Test Error Paths</h3>
            <p>Write tests specifically for error conditions to ensure proper error handling.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
