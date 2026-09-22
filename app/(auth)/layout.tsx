import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to AI Habit Coach",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Panel */}
        <section
          className="hidden bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white 
               lg:flex flex-col justify-between p-12"
        >
          <div>
            <Link href="/" className="text-3xl font-bold">
              AI Habit Coach
            </Link>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Build Better Habits.
              <br />
              Powered by AI.
            </h1>

            <p className="max-w-md text-lg opacity-90">
              Track habits, predict streak risks, receive AI coaching, and stay
              consistent every day.
            </p>
          </div>

          <p className="text-sm opacity-70">© 2026 AI Habit Coach</p>
        </section>

        {/* Right Panel */}
        <section className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
