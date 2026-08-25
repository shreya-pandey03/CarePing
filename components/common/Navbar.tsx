"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggle from "./ThemeToggle";
import NotificationBell from "../notifications/NotificationBell";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <p className="text-sm text-muted-foreground">Welcome back 👋</p>
        </div>
      </div>

      {/* Center */}
      <ThemeToggle />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1 hover:bg-accent">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image ?? ""} />

              <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="font-medium">{user.name}</p>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
