import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Calendar, FileText, Home, LogOut, User, Users } from "lucide-react"
import Link from "next/link"
import * as React from "react"

const navLinks = [
  { href: "/dashboard/manager-dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { href: "/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { href: "/timesheets", label: "Timesheets", icon: <FileText className="w-5 h-5" /> },
  { href: "/leave/leave-application", label: "Leaves", icon: <Calendar className="w-5 h-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center h-16 text-xl font-bold tracking-wide">
          Employee Manager
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild>
                  <Link href={link.href} className="flex items-center gap-3 font-medium">
                    {link.icon}
                    {link.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="mb-6 px-6">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors text-base font-medium">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
