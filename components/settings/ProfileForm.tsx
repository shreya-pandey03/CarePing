"use client";

import { useState, useTransition } from "react";

import { User, Mail, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { updateProfile } from "@/actions/updateProfile";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name);

  const [image, setImage] = useState(user.image ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      await updateProfile({
        name,
        image,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>

        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <Label>Profile Image URL</Label>

              <div className="mt-2 flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                />

                <Button type="button" variant="outline">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Name</Label>

            <Input
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input className="pl-10" value={user.email} disabled />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Your email is managed by your authentication provider.
            </p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
