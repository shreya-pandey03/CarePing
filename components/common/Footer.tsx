import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 text-sm text-muted-foreground md:flex-row">
        {/* Left */}
        <div className="text-center md:text-left">
          <p>© {year} AI Habit Coach. All rights reserved.</p>
        </div>

        {/* Center */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <Link
            href="/habits"
            className="transition-colors hover:text-foreground"
          >
            Habits
          </Link>

          <Link
            href="/analytics"
            className="transition-colors hover:text-foreground"
          >
            Analytics
          </Link>

          <Link
            href="/reports"
            className="transition-colors hover:text-foreground"
          >
            Reports
          </Link>
        </div>

        {/* Right */}
        <div className="text-center md:text-right">
          <p>
            Built with ❤️ using Next.js 16, Bun, Drizzle, Neon, Redis & Gemini
            AI
          </p>
        </div>
      </div>
    </footer>
  );
}
