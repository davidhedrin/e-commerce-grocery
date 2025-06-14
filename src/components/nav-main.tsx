"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { GroupAppsMenu } from "@/lib/models-type"
import Link from "next/link"
import { useLoading } from "./loading-context"

export function NavMain({
  items,
}: {
  items: GroupAppsMenu
}) {
  const { setLoading } = useLoading();

  return (
    <SidebarGroup className="py-1">
      <SidebarGroupLabel><i className='bx bxs-circle text-[9px] me-1 text-blue-600'></i> {items.groupName}</SidebarGroupLabel>
      <SidebarMenu className="gap-1 gap-y-0">
        {items.menus.map((item, x) => (
          <Collapsible key={x} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link onClick={() => setLoading(true)} href={item.url}>
                  <i className={`${item.icon} text-lg`}></i>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem, y) => (
                        <SidebarMenuSubItem key={x + "_" + y}>
                          <SidebarMenuSubButton asChild>
                            <Link onClick={() => setLoading(true)} href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
