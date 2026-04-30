import * as React from "react";

import { getUserFromMeResponse, useMeQuery } from "@/app/api/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Newspaper,
  Link as LinkIcon,
  Shield,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";
import { NavUser } from "./Side-User";

const data = {
  navMain: [
    {
      title: "Admin panel",
      items: [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Admins",
          url: "/admins",
          icon: Shield,
          superuserOnly: true,
        },
        {
          title: "Categories",
          url: "/categories",
          icon: Tags,
        },
        {
          title: "News",
          url: "/news",
          icon: Newspaper,
        },
        {
          title: "Recommendations",
          url: "/recommendations",
          icon: LinkIcon,
        },
        {
          title: "Team",
          url: "/team",
          icon: Users,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: meData } = useMeQuery();
  const user = meData ? getUserFromMeResponse(meData) : null;
  const isSuperuser = user?.role === "superuser";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <div className="flex aspect-square size-11 items-center justify-center rounded-lg">
                  <img src="/logo.webp" alt="logo" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">PS Termiz Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items
                  .filter((item) => !item.superuserOnly || isSuperuser)
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          end={item.url === "/"}
                          to={item.url}
                        >
                          <item.icon data-icon="inline-start" />
                          {item.title}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
