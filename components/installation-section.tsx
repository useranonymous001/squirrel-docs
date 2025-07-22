"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Terminal, CheckCircle } from "lucide-react"
import { useState } from "react"

export function InstallationSection() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Installation</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Get Started in Seconds</h2>
            <p className="text-xl text-muted-foreground">Install Squirrel Framework with a single command</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Install via Go Modules
              </CardTitle>
              <CardDescription>Requires Go 1.22 or later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                  <span className="text-muted-foreground">$ </span>
                  <span>go get github.com/useranonymous001/squirrel</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard("go get github.com/useranonymous001/squirrel")}
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold">Install</h3>
              <p className="text-sm text-muted-foreground">Add Squirrel to your Go project</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold">Import</h3>
              <p className="text-sm text-muted-foreground">Import and create your server</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold">Deploy</h3>
              <p className="text-sm text-muted-foreground">Build and deploy your application</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
