"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Github, Zap, Shield, Code } from "lucide-react"
import { AuroraBackground } from "@/components/aurora-background"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 container px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              🎉 Now available - v1.0.0
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build Fast Web Apps with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Squirrel🐿️</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A simple and minimalist web framework for Go. Fast, lightweight, and developer-friendly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="group">
              <Link href="/docs/getting-started">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/useranonymous001/squirrel" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 backdrop-blur border">
              <Zap className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground text-center">
                Built for performance with minimal overhead and optimized routing.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 backdrop-blur border">
              <Code className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold">Developer Friendly</h3>
              <p className="text-sm text-muted-foreground text-center">
                Simple API design that feels familiar and intuitive to use.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 backdrop-blur border">
              <Shield className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold">Production Ready</h3>
              <p className="text-sm text-muted-foreground text-center">
                Built-in middleware, error handling, and recovery mechanisms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
