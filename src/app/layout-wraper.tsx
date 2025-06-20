"use client";

import { usePathname } from 'next/navigation';
import React from 'react'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ModeToggle } from '@/components/mode-toggle';
import { Navbar } from "@/components/navbar";
import { Footer } from '@/components/footer';
import { Separator } from "@/components/ui/separator";

export default function LayoutWraper({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const isAdminLayout = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/not-found';

  return (
    <>
      {
        isAdminLayout ? <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 62)",
              "--header-height": "calc(var(--spacing) * 10)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="relative flex flex-col gap-3 overflow-auto p-4 lg:p-5 lg:py-3">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider> : <div className="flex flex-col min-h-screen bg-muted">
          <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 z-50">
            <ModeToggle variant={'outline'} />
          </div>

          {!isAuthPage && (
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Navbar />
            </div>
          )}

          <main className="flex-grow">
            {children}
          </main>

          {!isAuthPage && <Footer />}
        </div>
      }
    </>
  )
}
