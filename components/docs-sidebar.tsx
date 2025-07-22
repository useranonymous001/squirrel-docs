"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Book, Code, Zap, FileText, LucideIcon } from "lucide-react"

interface NavigationItem {
  title: string
  href?: string
  items?: NavigationItem[]
}

interface NavigationGroup {
  title: string
  icon: LucideIcon
  items: NavigationItem[]
}

const navigation: NavigationGroup[] = [
  {
    title: "Getting Started",
    icon: Zap,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    items: [
      { title: "Overview", href: "/docs/api" },
      {
        title: "Core Types",
        items: [
          { title: "Request", href: "/docs/api/request" },
          { title: "Response", href: "/docs/api/response" },
          { title: "SqurlMux", href: "/docs/api/squrlmux" },
          { title: "HandlerFunc", href: "/docs/api/handler" },
        ],
      },
      {
        title: "Middleware",
        items: [
          { title: "Middleware Type", href: "/docs/api/middleware" },
          { title: "Built-in Middleware", href: "/docs/api/built-in-middleware" },
        ],
      },
      {
        title: "Utilities",
        items: [
          { title: "Cookies", href: "/docs/api/cookies" },
          { title: "Static Files", href: "/docs/api/static" },
          { title: "Server Functions", href: "/docs/api/functions" },
        ],
      },
    ],
  },
  {
    title: "Guides",
    icon: Book,
    items: [
      { title: "Routing", href: "/docs/guides/routing" },
      { title: "Middleware", href: "/docs/guides/middleware" },
      { title: "Request Handling", href: "/docs/guides/request-handling" },
      { title: "Response Management", href: "/docs/guides/response-management" },
      { title: "Error Handling", href: "/docs/guides/error-handling" },
      { title: "Static Files", href: "/docs/guides/static-files" },
    ],
  },
  {
    title: "Examples",
    icon: FileText,
    items: [
      { title: "Basic Server", href: "/docs/examples/basic-server" },
      { title: "REST API", href: "/docs/examples/rest-api" },
      { title: "Middleware Usage", href: "/docs/examples/middleware" },
      { title: "File Upload", href: "/docs/examples/file-upload" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>(["Getting Started", "API Reference"])

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((title) => title !== groupTitle) : [...prev, groupTitle],
    )
  }

  const isActive = (href: string) => pathname === href

  
  console.log(openGroups, toggleGroup);
  

  const renderMenuItem = (item: NavigationItem, level = 0) => {
    if (item.items) {
      return (
        <Collapsible key={item.title} defaultOpen={level === 0}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between">
                <span>{item.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem: NavigationItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    {subItem.items ? (
                      renderMenuItem(subItem, level + 1)
                    ) : (
                      <SidebarMenuSubButton asChild isActive={isActive(subItem.href!)}>
                        <Link href={subItem.href!}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.href!)}>
          <Link href={item.href!}>{item.title}</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <group.icon className="h-4 w-4" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map((item) => renderMenuItem(item))}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}