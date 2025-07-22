import Link from "next/link"
import { Github, Twitter, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br  flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐿️</span>
              </div>
              <span className="font-bold text-xl">Squirrel</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A simple and minimalist web framework for Go. Fast, lightweight, and developer-friendly.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/useranonymous001/squirrel" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://twitter.com/KhatriRohan1106" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/getting-started"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/guides" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/docs/examples" className="text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/useranonymous001/squirrel"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/useranonymous001/squirrel/discussions"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discussions
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/useranonymous001/squirrel/issues"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report Bug
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/useranonymous001/squirrel/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contributing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/guides/routing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Routing Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/guides/middleware"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Middleware Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api/built-in-middleware"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Built-in Middleware
                </Link>
              </li>
              <li>
                <Link
                  href="https://go.dev/doc/"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Go Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Squirrel Framework.</span>
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the Go community.</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link
              href="https://github.com/useranonymous001/squirrel/blob/main/LICENSE"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              MIT License
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
