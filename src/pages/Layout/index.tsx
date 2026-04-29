import { AppSidebar } from "@/components/Sidebar/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMeQuery } from "@/app/api/auth"
import { Outlet } from "react-router"

export default function Page() {
  useMeQuery()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex min-h-16 shrink-0 items-center gap-3 border-b px-4 py-3">
          <SidebarTrigger className="-ml-1" />
          <div
            className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between"
            id="dashboard-navbar-header"
          />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 px-7">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
