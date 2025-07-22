import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Squirrel Framework - A minimalist web framework for Go",
  description:
    "Simple and powerful web framework for Go with routing, middleware support, and request/response handling capabilities.",
  keywords: ["go", "golang", "web framework", "http", "router", "middleware"],
  authors: [{ name: "Squirrel Framework Team" }],
  openGraph: {
    title: "Squirrel Framework",
    description: "A minimalist web framework for Go",
    url: "https://squirrel-framework.dev",
    siteName: "Squirrel Framework",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
