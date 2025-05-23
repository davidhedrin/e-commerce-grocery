"use client";

import { cn } from "@/lib/utils";

export default function LoadingUI({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-1">
        <i className='bx bx-shopping-bag bx-tada text-3xl'></i>
        <p className='text-sm font-medium'>Cazh POS...</p>
      </div>
    </div>
  )
}
