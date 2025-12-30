"use client";

import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || (item.url === "/dashboard" && pathname === "/")

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "group relative h-11 px-4 mb-1 rounded-lg overflow-hidden",
                    isActive
                      ? "bg-slate-100 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-500 hover:bg-transparent"
                  )}
                >
                  <a href={item.url} className="flex items-center gap-3 w-full">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                    )}
                    {Icon && (
                      <Icon
                        className={cn(
                          "size-5",
                          isActive ? "text-orange-500" : "text-slate-400"
                        )}
                      />
                    )}
                    <span className="text-[14.5px] tracking-tight">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
