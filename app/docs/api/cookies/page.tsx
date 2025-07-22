import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Type</Badge>
          <Badge variant="outline">Utilities</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Cookies</h1>
        <p className="text-xl text-muted-foreground">
          Cookie handling utilities for managing HTTP cookies in Squirrel Framework.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cookie Type Definition</h2>
        <div className="rounded-lg border bg-muted/50 p-6">
          <pre className="text-sm overflow-x-auto">
            <code>{`type Cookie struct {
    Name   string // name of the cookie
    Value  string // cookie value
    Quoted bool   // indicates whether the Value was initially Quoted or not
    
    Path       string    // optional
    Domain     string    // optional
    Expires    time.Time // optional
    RawExpires string    // optional
    
    // MaxAge = 0; means no 'MaxAge' attributes set
    // MaxAge < 0; means delete cookie now, equivalently MaxAge = 0
    // MaxAge > 0; means Max-Age attribute present and available in seconds
    MaxAge   int
    Secure   bool
    HttpOnly bool
    SameSite SameSite
    Raw      string
    Unparsed []string // Raw text of unparsed attribute-value pairs
}`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cookie Functions</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">FormatSetCookie()</h3>
            <p className="text-muted-foreground">Serializes a cookie struct into a string for the Set-Cookie header.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func FormatSetCookie(c Cookie) string</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import "github.com/useranonymous001/squirrel/cookies"

func setCookieExample(req *Request, res *Response) {
    // Create a cookie
    sessionCookie := cookies.Cookie{
        Name:     "session_id",
        Value:    "abc123xyz789",
        Path:     "/",
        Domain:   "example.com",
        MaxAge:   3600, // 1 hour
        HttpOnly: true,
        Secure:   true,
        SameSite: cookies.SameSiteStrictMode,
    }
    
    // Format the cookie for Set-Cookie header
    cookieString := cookies.FormatSetCookie(sessionCookie)
    
    // Manually set the header (usually you'd use res.SetCookie())
    res.SetHeader("Set-Cookie", cookieString)
    
    res.JSON(map[string]string{
        "message": "Cookie set",
        "cookie": cookieString,
    })
    res.Send()
}

// Output: "session_id=abc123xyz789; Path=/; Domain=example.com; Max-Age=3600; HttpOnly; Secure; SameSite=Strict"`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">ParseCookieHeader()</h3>
            <p className="text-muted-foreground">Parses the Cookie header from incoming requests.</p>

            <Tabs defaultValue="signature" className="w-full">
              <TabsList>
                <TabsTrigger value="signature">Signature</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="signature">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="text-sm">
                    <code>func ParseCookieHeader(header string) []cookies.Cookie</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`func parseCookiesExample(req *Request, res *Response) {
    // Get the Cookie header
    cookieHeader := req.Headers["Cookie"]
    
    if cookieHeader != "" {
        // Parse all cookies from the header
        cookies := cookies.ParseCookieHeader(cookieHeader)
        
        // Process each cookie
        for _, cookie := range cookies {
            fmt.Printf("Cookie: %s = %s\\n", cookie.Name, cookie.Value)
        }
        
        res.JSON(map[string]interface{}{
            "message": "Cookies parsed",
            "count": len(cookies),
            "cookies": cookies,
        })
    } else {
        res.JSON(map[string]string{
            "message": "No cookies found",
        })
    }
    
    res.Send()
}

// Example Cookie header: "session_id=abc123; theme=dark; lang=en"
// Parsed result: 
// [
//   {Name: "session_id", Value: "abc123"},
//   {Name: "theme", Value: "dark"},
//   {Name: "lang", Value: "en"}
// ]`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Working with Cookies</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Setting Cookies</h3>
            <p className="text-muted-foreground">
              How to set cookies in responses using the Response.SetCookie() method.
            </p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`server.Post("/login", func(req *Request, res *Response) {
    // Simulate login validation
    body, _ := req.ReadBodyAsString()
    
    // Create session cookie
    sessionCookie := &cookies.Cookie{
        Name:     "session_id",
        Value:    "user_session_" + generateSessionID(),
        Path:     "/",
        MaxAge:   86400, // 24 hours
        HttpOnly: true,  // Prevent XSS attacks
        Secure:   true,  // HTTPS only
        SameSite: cookies.SameSiteStrictMode,
    }
    
    // Create user preference cookie
    themeCookie := &cookies.Cookie{
        Name:   "user_theme",
        Value:  "dark",
        Path:   "/",
        MaxAge: 86400 * 30, // 30 days
    }
    
    // Set cookies
    res.SetCookie(sessionCookie)
    res.SetCookie(themeCookie)
    
    res.JSON(map[string]string{
        "message": "Login successful",
        "sessionId": sessionCookie.Value,
    })
    res.Send()
})

func generateSessionID() string {
    return fmt.Sprintf("%d", time.Now().UnixNano())
}`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Reading Cookies</h3>
            <p className="text-muted-foreground">
              How to read cookies from requests using the Request.GetCookie() method.
            </p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`server.Get("/profile", func(req *Request, res *Response) {
    // Get session cookie
    sessionCookie := req.GetCookie("session_id")
    if sessionCookie == nil {
        res.SetStatus(401)
        res.JSON(map[string]string{
            "error": "No session found. Please login.",
        })
        res.Send()
        return
    }
    
    // Get user preferences
    themeCookie := req.GetCookie("user_theme")
    theme := "light" // default
    if themeCookie != nil {
        theme = themeCookie.Value
    }
    
    // Get language preference
    langCookie := req.GetCookie("user_lang")
    language := "en" // default
    if langCookie != nil {
        language = langCookie.Value
    }
    
    res.JSON(map[string]interface{}{
        "sessionId": sessionCookie.Value,
        "preferences": map[string]string{
            "theme": theme,
            "language": language,
        },
        "message": "Profile data retrieved",
    })
    res.Send()
})`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Deleting Cookies</h3>
            <p className="text-muted-foreground">How to delete cookies by setting MaxAge to -1.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`server.Post("/logout", func(req *Request, res *Response) {
    // Delete session cookie
    sessionCookie := &cookies.Cookie{
        Name:     "session_id",
        Value:    "",
        Path:     "/",
        MaxAge:   -1, // Delete immediately
        HttpOnly: true,
        Secure:   true,
    }
    
    // Delete theme cookie
    themeCookie := &cookies.Cookie{
        Name:   "user_theme",
        Value:  "",
        Path:   "/",
        MaxAge: -1,
    }
    
    res.SetCookie(sessionCookie)
    res.SetCookie(themeCookie)
    
    res.JSON(map[string]string{
        "message": "Logged out successfully",
    })
    res.Send()
})`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Cookie Security Best Practices</h3>
            <p className="text-muted-foreground">Important security considerations when working with cookies.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Secure cookie configuration
func createSecureCookie(name, value string) *cookies.Cookie {
    return &cookies.Cookie{
        Name:     name,
        Value:    value,
        Path:     "/",
        MaxAge:   3600, // 1 hour
        HttpOnly: true,  // Prevent XSS - JavaScript cannot access
        Secure:   true,  // HTTPS only
        SameSite: cookies.SameSiteStrictMode, // CSRF protection
    }
}

// Authentication middleware using secure cookies
func authMiddleware(next HandlerFunc) HandlerFunc {
    return func(req *Request, res *Response) {
        sessionCookie := req.GetCookie("secure_session")
        
        if sessionCookie == nil {
            res.SetStatus(401)
            res.JSON(map[string]string{
                "error": "Authentication required",
            })
            res.Send()
            return
        }
        
        // Validate session (implement your own validation logic)
        if !isValidSession(sessionCookie.Value) {
            // Delete invalid cookie
            invalidCookie := &cookies.Cookie{
                Name:     "secure_session",
                Value:    "",
                Path:     "/",
                MaxAge:   -1,
                HttpOnly: true,
                Secure:   true,
            }
            res.SetCookie(invalidCookie)
            
            res.SetStatus(401)
            res.JSON(map[string]string{
                "error": "Invalid session",
            })
            res.Send()
            return
        }
        
        next(req, res)
    }
}

func isValidSession(sessionID string) bool {
    // Implement your session validation logic
    // Check against database, cache, etc.
    return sessionID != "" && len(sessionID) > 10
}

// Cookie security checklist:
// ✅ Use HttpOnly for sensitive cookies
// ✅ Use Secure flag for HTTPS
// ✅ Set appropriate SameSite policy
// ✅ Use reasonable MaxAge values
// ✅ Validate cookie values
// ✅ Delete cookies on logout`}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">SameSite Cookie Policies</h3>
            <p className="text-muted-foreground">Understanding different SameSite policies for CSRF protection.</p>

            <div className="rounded-lg border bg-muted/50 p-6">
              <pre className="text-sm overflow-x-auto">
                <code>{`// SameSite policy examples

// Strict: Cookie only sent with same-site requests
strictCookie := &cookies.Cookie{
    Name:     "strict_session",
    Value:    "session_value",
    SameSite: cookies.SameSiteStrictMode,
    // Best for: Authentication cookies, sensitive data
    // Limitation: Not sent on external links to your site
}

// Lax: Cookie sent with same-site requests and top-level navigation
laxCookie := &cookies.Cookie{
    Name:     "lax_session",
    Value:    "session_value",
    SameSite: cookies.SameSiteLaxMode,
    // Best for: General session cookies
    // Balance between security and usability
}

// None: Cookie sent with all requests (requires Secure flag)
noneCookie := &cookies.Cookie{
    Name:     "tracking_cookie",
    Value:    "tracking_value",
    SameSite: cookies.SameSiteNoneMode,
    Secure:   true, // Required when SameSite=None
    // Best for: Third-party integrations, embedded content
    // Security risk: Vulnerable to CSRF attacks
}

// Default (no SameSite specified): Browser default behavior
defaultCookie := &cookies.Cookie{
    Name:  "default_cookie",
    Value: "default_value",
    // Browser will apply its default policy (usually Lax)
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Always use secure cookie practices in production: set <code>HttpOnly</code> for sensitive cookies, use{" "}
          <code>Secure</code> flag with HTTPS, and choose appropriate <code>SameSite</code> policies. The{" "}
          <code>MaxAge</code> field controls cookie lifetime: positive values set expiration time, 0 means session
          cookie, and -1 deletes the cookie immediately.
        </AlertDescription>
      </Alert>
    </div>
  )
}
