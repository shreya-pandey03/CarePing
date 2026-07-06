"use client";

import Link from "next/link";

const items = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Habits",
    href: "/habits",
  },
  {
    name: "Analytics",
    href: "/habits/analytics",
  },
  {
    name: "Reports",
    href: "/reports/weekly",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <h1 className="mb-8 text-2xl font-bold">Habit Coach</h1>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg p-3 hover:bg-muted"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
