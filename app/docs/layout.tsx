import type React from "react"
import { DocsSidebar } from "@/components/docs-sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Github } from "lucide-react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
              <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/useranonymous001/squirrel" target="_blank">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-2">GitHub</span>
              </Link>
            </Button>
            </BreadcrumbItem>

            <BreadcrumbItem className="hidden md:block ">
              <Button variant="ghost" size="sm" asChild>
              <Link href="/" target="_blank">
                <span className="hidden sm:inline-block ml-2">Home</span>
              </Link>
            </Button>
            </BreadcrumbItem>


              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Page</BreadcrumbPage>
              </BreadcrumbItem>

            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl mx-auto px-6 py-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
