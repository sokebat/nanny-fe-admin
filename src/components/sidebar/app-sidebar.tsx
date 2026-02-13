"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  BarChart3,
  CreditCard,
  Layers,
  LayoutGrid,
  List,
  NotebookTabs,
  Receipt,
  Star,
  Users,
  UsersRound
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutGrid,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Manage Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Team Management",
      url: "/team",
      icon: UsersRound,
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
      title: "Subscriptions",
      url: "/subscriptions",
      icon: CreditCard,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Receipt,
    },
    // {
    //   title: "Listing Requests",
    //   url: "/listing",
    //   icon: List,
    // },
    // {
    //   title: "Perks & Benefits",
    //   url: "/perks",
    //   icon: Star,
    // },
    {
      title: "Reviews",
      url: "/reviews",
      icon: Star,
    }
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
