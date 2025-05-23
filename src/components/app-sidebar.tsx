"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { GroupAppsMenu } from "@/lib/models-type"
import Configs from "@/lib/config"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
}

const menus: GroupAppsMenu[] = [
  {
    groupName: "Apps",
    menus: [
      {
        title: "Dashboard",
        url: "/apps/dashboard",
        icon: "bx bx-tachometer",
      },
      {
        title: "Catalog",
        url: "#",
        icon: "bx bx-cart-add",
      },
      {
        title: "Transactions",
        url: "#",
        icon: "bx bx-receipt",
      },
    ]
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appName = Configs.app_name;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-blue-600 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <i className='bx bx-shopping-bag text-2xl'></i>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-blue-600">{appName}</span>
                  <span className="truncate text-xs">Smart & Easy Grocery</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-y-1">
        {
          menus.map((x, index) => {
            return <NavMain key={index} items={x} />
          })
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
