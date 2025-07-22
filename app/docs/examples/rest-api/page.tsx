export default function RestApiExamplePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">REST API Example</h1>
        <p className="text-xl text-muted-foreground">
          A complete RESTful API with CRUD operations and database integration
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Complete REST API</h2>
          <p className="mb-4">This example demonstrates a full REST API for managing users:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre>
              <code>{`package main

import (
    "encoding/json"
    "fmt"
    "log"
    "strconv"
    "sync"
    "time"
    "github.com/user001/squirrel"
)

// User represents a user in our system
type User struct {
    ID        int       \`json:"id"\`
    Name      string    \`json:"name"\`
    Email     string    \`json:"email"\`
    CreatedAt time.Time \`json:"created_at"\`
    UpdatedAt time.Time \`json:"updated_at"\`
}

// In-memory database (use a real database in production)
type UserStore struct {
    users  map[int]*User
    nextID int
    mutex  sync.RWMutex
}

func NewUserStore() *UserStore {
    return &UserStore{
        users:  make(map[int]*User),
        nextID: 1,
    }
}

func (s *UserStore) Create(user *User) *User {
    s.mutex.Lock()
    defer s.mutex.Unlock()
    
    user.ID = s.nextID
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()
    s.users[user.ID] = user
    s.nextID++
    
    return user
}

func (s *UserStore) GetAll() []*User {
    s.mutex.RLock()
    defer s.mutex.RUnlock()
    
    users := make([]*User, 0, len(s.users))
    for _, user := range s.users {
        users = append(users, user)
    }
    return users
}

func (s *UserStore) GetByID(id int) *User {
    s.mutex.RLock()
    defer s.mutex.RUnlock()
    
    return s.users[id]
}

func (s *UserStore) Update(id int, updates *User) *User {
    s.mutex.Lock()
    defer s.mutex.Unlock()
    
    user := s.users[id]
    if user == nil {
        return nil
    }
    
    if updates.Name != "" {
        user.Name = updates.Name
    }
    if updates.Email != "" {
        user.Email = updates.Email
    }
    user.UpdatedAt = time.Now()
    
    return user
}

func (s *UserStore) Delete(id int) bool {
    s.mutex.Lock()
    defer s.mutex.Unlock()
    
    if _, exists := s.users[id]; !exists {
        return false
    }
    
    delete(s.users, id)
    return true
}

// Global user store
var userStore = NewUserStore()

func main() {
    mux := squirrel.NewSqurlMux()
    
    // Middleware
    mux.Use(squirrel.LoggingMiddleware())
    mux.Use(squirrel.RecoveryMiddleware())
    mux.Use(corsMiddleware())
    mux.Use(jsonMiddleware())
    
    // API routes
    mux.HandleFunc("GET /api/users", listUsersHandler)
    mux.HandleFunc("POST /api/users", createUserHandler)
    mux.HandleFunc("GET /api/users/:id", getUserHandler)
    mux.HandleFunc("PUT /api/users/:id", updateUserHandler)
    mux.HandleFunc("DELETE /api/users/:id", deleteUserHandler)
    
    // Health check
    mux.HandleFunc("GET /api/health", healthHandler)
    
    // Seed some initial data
    seedData()
    
    fmt.Println("REST API server starting on http://localhost:8080")
    log.Fatal(squirrel.ListenAndServe(":8080", mux))
}

// Middleware functions
func corsMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            
            if r.Method == "OPTIONS" {
                w.WriteStatus(200)
                return
            }
            
            next(w, r)
        }
    }
}

func jsonMiddleware() squirrel.Middleware {
    return func(next squirrel.HandlerFunc) squirrel.HandlerFunc {
        return func(w *squirrel.Response, r *squirrel.Request) {
            w.Header().Set("Content-Type", "application/json")
            next(w, r)
        }
    }
}

// Handler functions
func listUsersHandler(w *squirrel.Response, r *squirrel.Request) {
    users := userStore.GetAll()
    w.JSON(map[string]interface{}{
        "users": users,
        "count": len(users),
    })
}

func createUserHandler(w *squirrel.Response, r *squirrel.Request) {
    var user User
    if err := r.ParseJSON(&user); err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Invalid JSON"})
        return
    }
    
    // Validation
    if user.Name == "" || user.Email == "" {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Name and email are required"})
        return
    }
    
    createdUser := userStore.Create(&user)
    w.WriteStatus(201)
    w.JSON(createdUser)
}

func getUserHandler(w *squirrel.Response, r *squirrel.Request) {
    idStr := r.PathValue("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Invalid user ID"})
        return
    }
    
    user := userStore.GetByID(id)
    if user == nil {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "User not found"})
        return
    }
    
    w.JSON(user)
}

func updateUserHandler(w *squirrel.Response, r *squirrel.Request) {
    idStr := r.PathValue("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Invalid user ID"})
        return
    }
    
    var updates User
    if err := r.ParseJSON(&updates); err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Invalid JSON"})
        return
    }
    
    user := userStore.Update(id, &updates)
    if user == nil {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "User not found"})
        return
    }
    
    w.JSON(user)
}

func deleteUserHandler(w *squirrel.Response, r *squirrel.Request) {
    idStr := r.PathValue("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        w.WriteStatus(400)
        w.JSON(map[string]string{"error": "Invalid user ID"})
        return
    }
    
    if !userStore.Delete(id) {
        w.WriteStatus(404)
        w.JSON(map[string]string{"error": "User not found"})
        return
    }
    
    w.WriteStatus(204)
}

func healthHandler(w *squirrel.Response, r *squirrel.Request) {
    w.JSON(map[string]interface{}{
        "status": "healthy",
        "timestamp": time.Now(),
        "users_count": len(userStore.GetAll()),
    })
}

func seedData() {
    userStore.Create(&User{Name: "John Doe", Email: "john@example.com"})
    userStore.Create(&User{Name: "Jane Smith", Email: "jane@example.com"})
    userStore.Create(&User{Name: "Bob Johnson", Email: "bob@example.com"})
}`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-600 mb-2">GET /api/users</h4>
              <p className="text-sm text-muted-foreground mb-2">List all users</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl http://localhost:8080/api/users</code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 mb-2">POST /api/users</h4>
              <p className="text-sm text-muted-foreground mb-2">Create a new user</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>
                  curl -X POST http://localhost:8080/api/users -H &quote;Content-Type: application/json&quote; -d &apos;
                  {/* {(&apos;name&quote;: &quote;Alice&apos;, &apos;email&quote;: &quote;alice@example.com&apos;)}&apos; */}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-600 mb-2">GET /api/users/:id</h4>
              <p className="text-sm text-muted-foreground mb-2">Get a specific user</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl http://localhost:8080/api/users/1</code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-orange-600 mb-2">PUT /api/users/:id</h4>
              <p className="text-sm text-muted-foreground mb-2">Update a user</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>
                  curl -X PUT http://localhost:8080/api/users/1 -H &quote;Content-Type: application/json&quote; -d &apos; &quote;data_here&quote;
                  {/* {'name": "John Updated'}' */}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-600 mb-2">DELETE /api/users/:id</h4>
              <p className="text-sm text-muted-foreground mb-2">Delete a user</p>
              <div className="bg-muted p-2 rounded text-sm">
                <code>curl -X DELETE http://localhost:8080/api/users/1</code>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Features Demonstrated</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">CRUD Operations</h4>
              <ul className="text-sm space-y-1">
                <li>• Create users (POST)</li>
                <li>• Read users (GET)</li>
                <li>• Update users (PUT)</li>
                <li>• Delete users (DELETE)</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Data Management</h4>
              <ul className="text-sm space-y-1">
                <li>• In-memory data store</li>
                <li>• Thread-safe operations</li>
                <li>• Data validation</li>
                <li>• Timestamps</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">HTTP Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Proper status codes</li>
                <li>• JSON responses</li>
                <li>• CORS support</li>
                <li>• Error handling</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm space-y-1">
                <li>• Middleware usage</li>
                <li>• Input validation</li>
                <li>• Consistent error responses</li>
                <li>• Health check endpoint</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Production Considerations</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">⚠️ Important Notes</h4>
            <ul className="text-sm space-y-1">
              <li>• This example uses in-memory storage - use a real database in production</li>
              <li>• Add authentication and authorization</li>
              <li>• Implement rate limiting</li>
              <li>• Add request validation middleware</li>
              <li>• Use proper logging and monitoring</li>
              <li>• Add pagination for list endpoints</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Add database integration (PostgreSQL, MySQL, etc.)</li>
            <li>Implement authentication with JWT tokens</li>
            <li>Add input validation with a validation library</li>
            <li>
              Explore the{" "}
              <a href="/docs/examples/middleware" className="text-blue-600 hover:underline">
                middleware example
              </a>
            </li>
            <li>
              Learn about{" "}
              <a href="/docs/guides/error-handling" className="text-blue-600 hover:underline">
                advanced error handling
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
