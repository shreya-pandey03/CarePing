"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Monitor, Moon, Sun } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>

        <CardDescription>
          Choose how Habitly looks on your device.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="h-24 flex-col gap-3"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-6 w-6" />
            Light
          </Button>

          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="h-24 flex-col gap-3"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-6 w-6" />
            Dark
          </Button>

          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="h-24 flex-col gap-3"
            onClick={() => setTheme("system")}
          >
            <Monitor className="h-6 w-6" />
            System
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Current theme: <span className="font-medium capitalize">{theme}</span>
        </p>
      </CardContent>
    </Card>
  );
}
