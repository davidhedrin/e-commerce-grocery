"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { UseAlertDialog } from "./alert-confirm"
import { toast } from "sonner"
import { signOutAuth } from "@/server/auth"
import { Session } from "next-auth"
import { clearSessionLogin } from "@/lib/utils"

export function NavUser({ user_data }: { user_data: Session | null }) {
  const [open, setOpen] = useState(false);
  const { openAlert } = UseAlertDialog();
  const { isMobile } = useSidebar();

  const signOutAction = async () => {
    setOpen(false);
    const confirmed = await openAlert({
      title: 'Want to Logout?',
      description: 'Are you sure you want to log out of your account?',
      textConfirm: 'Log Me Out',
      textClose: 'Not Now',
      icon: 'bx bx-log-out bx-tada text-red-500'
    });
    if (!confirmed) return;

    toast.success("Logged Out!", {
      description: "We'll be here when you're ready to log back in.",
    });
    clearSessionLogin();
    await signOutAuth();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user_data ? user_data.user?.image || "" : ""} alt={user_data ? user_data.user?.name || "" : ""} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user_data ? user_data.user?.name || "" : ""}</span>
                <span className="truncate text-xs">{user_data ? user_data.user?.email || "" : ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user_data ? user_data.user?.image || "" : ""} alt={user_data ? user_data.user?.name || "" : ""} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user_data ? user_data.user?.name || "" : ""}</span>
                  <span className="truncate text-xs">{user_data ? user_data.user?.email || "" : ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOutAction()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
