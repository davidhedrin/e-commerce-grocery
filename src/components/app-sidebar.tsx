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
import { useSession } from "next-auth/react"

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
        title: "Transactions",
        url: "#",
        icon: "bx bx-cart-add",
      }
    ]
  },
  {
    groupName: "Warehouse",
    menus: [
      {
        title: "Product",
        url: "/product",
        icon: "bx bx-package",
        items: [
          {
            title: "Categories",
            url: "/product/category"
          },
        ]
      },
      {
        title: "Inventory",
        url: "#",
        icon: "bx bx-archive"
      },
      {
        title: "Discounts",
        url: "#",
        icon: "bx bx-purchase-tag-alt"
      },
    ]
  },
  {
    groupName: "Reports & Analytics",
    menus: [
      {
        title: "Sales",
        url: "#",
        icon: "bx bx-line-chart"
      },
      {
        title: "Stock",
        url: "#",
        icon: "bx bx-bar-chart-alt-2"
      },
      {
        title: "Product Traffic",
        url: "#",
        icon: "bx bx-stats"
      },
      {
        title: "Financial",
        url: "#",
        icon: "bx bx-calculator"
      },
    ]
  },
  {
    groupName: "Setting",
    menus: [
      {
        title: "Store Info",
        url: "#",
        icon: "bx bx-store-alt"
      },
      {
        title: "Activity Logs",
        url: "#",
        icon: "bx bx-history"
      },
      {
        title: "My Profile",
        url: "#",
        icon: "bx bx-id-card"
      },
    ]
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appName = Configs.app_name;
  const { data, status } = useSession();

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
        <NavUser user_data={data} />
      </SidebarFooter>
    </Sidebar>
  )
}
