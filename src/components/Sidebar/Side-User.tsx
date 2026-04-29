"use client"

import {
  ChevronsUpDown,
  LogOut,
  Settings,
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
import { useNavigate } from "react-router"
import { baseApi } from "@/app/api/baseApi"
import { getUserFromMeResponse, useMeQuery } from "@/app/api/auth"
import { clearAuthTokens } from "@/lib/auth"
import { useDispatch } from "react-redux"

export function NavUser({
  user = {
    name : "Dalerbek",
    email:"miyuratatsu@gmail.com",
    avatar: 'https://github.com/shadcn.png'
  },
}: {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data } = useMeQuery()
  const authUser = data ? getUserFromMeResponse(data) : null
  const activeUser = {
    name: authUser?.name ?? authUser?.fullName ?? user.name,
    email: authUser?.email ?? user.email,
    avatar: authUser?.avatar ?? user.avatar,
  }

  const handleLogout = () => {
    clearAuthTokens()
    dispatch(baseApi.util.resetApiState())
    navigate("/login", { replace: true })
  }

  const handleSettings = () => {
    navigate("/settings")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={activeUser.avatar} alt={activeUser.name} />
                <AvatarFallback className="rounded-lg">
                  {activeUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeUser.name}</span>
                <span className="truncate text-xs">{activeUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={activeUser.avatar} alt={activeUser.name} />
                  <AvatarFallback className="rounded-lg">
                    {activeUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeUser.name}</span>
                  <span className="truncate text-xs">{activeUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
