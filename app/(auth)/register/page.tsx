"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Create Account</CardTitle>

        <CardDescription>Start your AI habit journey.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/onboarding",
            })
          }
        >
          Sign up with Google
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            signIn("github", {
              callbackUrl: "/onboarding",
            })
          }
        >
          Sign up with GitHub
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
