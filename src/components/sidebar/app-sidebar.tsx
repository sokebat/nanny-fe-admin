"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Building2,
  Layers,
  LayoutGrid,
  LucideIcon,
  NotebookTabs,
  Settings2,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "admin",
    email: "admin@nannyplug.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Manage Perks",
      url: "/perks",
      icon: Building2,
    },
    {
      title: "Manage Listing",
      url: "/listings",
      icon: SlidersHorizontal,
    },
    {
      title: "Manage Courses",
      url: "/courses",
      icon: NotebookTabs,
    },
    {
      title: "Manage Resources",
      url: "/resources",
      icon: Layers,
    },
    {
      title: "Purchase Request",
      url: "/purchase-requests",
      icon: UserRound,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-3 py-4">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                N
              </div>
              <span className="text-slate-900 font-bold tracking-tight text-lg">
                Nanny Plug <span className="text-orange-500">Admin</span>
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
