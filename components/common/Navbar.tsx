"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b px-6">
      <h2 className="font-semibold">
        Dashboard
      </h2>

      <button
        onClick={() => signOut()}
        className="rounded-lg border px-4 py-2"
      >
        Logout
      </button>
    </nav>
  );
}