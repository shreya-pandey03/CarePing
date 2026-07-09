"use client";

import { Menu, Bell, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <p className="text-sm text-muted-foreground">Welcome back 👋</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />

                <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
            </Button>
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
