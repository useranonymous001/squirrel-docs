export default function ExamplesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-xl text-muted-foreground">
          Complete examples and tutorials to get you started with Squirrel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">
            <a href="/docs/examples/basic-server" className="text-blue-600 hover:underline">
              Basic Server
            </a>
          </h3>
          <p className="text-muted-foreground mb-4">A simple HTTP server with basic routing and middleware setup.</p>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Basic routing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>JSON responses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Logging middleware</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">
            <a href="/docs/examples/rest-api" className="text-blue-600 hover:underline">
              REST API
            </a>
          </h3>
          <p className="text-muted-foreground mb-4">
            A complete RESTful API with CRUD operations and database integration.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>CRUD operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Database integration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Error handling</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">
            <a href="/docs/examples/middleware" className="text-blue-600 hover:underline">
              Middleware Usage
            </a>
          </h3>
          <p className="text-muted-foreground mb-4">
            Advanced middleware patterns including authentication and rate limiting.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Rate limiting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Custom middleware</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">
            <a href="/docs/examples/file-upload" className="text-blue-600 hover:underline">
              File Upload
            </a>
          </h3>
          <p className="text-muted-foreground mb-4">Handle file uploads with validation, storage, and serving.</p>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>File validation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>Secure storage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>File serving</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
        <div className="bg-muted p-6 rounded-lg">
          <p className="mb-4">
            Each example includes complete, runnable code that you can copy and modify for your own projects. All
            examples assume you have Go installed and a basic understanding of Go programming.
          </p>
          <div className="space-y-2">
            <p>
              <strong>Prerequisites:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Go 1.19 or later</li>
              <li>Basic knowledge of Go and HTTP concepts</li>
              <li>Squirrel framework installed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
