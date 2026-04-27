import { AppSidebar } from "@/components/Sidebar/Sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { clearAuthToken } from "@/lib/auth"
import { LogOut } from "lucide-react"
import { Outlet, useNavigate } from "react-router"

export default function Page() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthToken()
    navigate("/login", { replace: true })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button className="ml-auto" onClick={handleLogout} variant="outline">
            <LogOut data-icon="inline-start" />
            Chiqish
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 px-7">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
