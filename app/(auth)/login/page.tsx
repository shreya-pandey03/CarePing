"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Welcome Back</CardTitle>

        <CardDescription>Sign in to continue your habits.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
        >
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            signIn("github", {
              callbackUrl: "/dashboard",
            })
          }
        >
          Continue with GitHub
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
