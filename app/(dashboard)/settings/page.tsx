import { redirect } from "next/navigation";

import { auth } from "@/auth";

import ProfileForm from "@/components/settings/ProfileForm";
import ThemeSettings from "@/components/settings/ThemeSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="text-muted-foreground">
          Manage your profile, notifications, appearance, and account
          preferences.
        </p>
      </div>

      <ProfileForm
        user={{
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          image: session.user.image ?? "",
        }}
      />

      <ThemeSettings />

      <NotificationSettings />

      <AccountSettings />
    </div>
  );
}
