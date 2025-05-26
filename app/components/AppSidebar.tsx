"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/actions";
import { Home, LogOut } from "lucide-react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Elections",
      url: "#",
      items: [
        {
          title: "Create Election",
          url: "/admin/createElection",
        },
        {
          title: "Manage Election",
          url: "/admin/selectElection",
        },
      ],
    },
    {
      title: "Admins",
      url: "#",
      items: [
        {
          title: "Add Admins",
          url: "/admin/addAdmin",
        },
        {
          title: "Authorize Admins",
          url: "/admin/authorize",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="p-2">
          <Link href="/admin">
            <Home />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.url)}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full flex flex-col gap-4 p-8">
          <Button asChild>
            <Link href="/">
              <Home /> Go to home page
            </Link>
          </Button>
          <Button variant="outline" onClick={logOut}>
            <LogOut />
            Log out
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
