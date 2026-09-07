import "./globals.css";
import Link from "next/link";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = {
  title: "Japan Career & Living Assistant",
  description: "Explore Japan IT careers, salaries, cities, living costs, language guidance, and visa resources.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = currentUserId();
  const user = userId ? await db.user.findUnique({ where: { id: userId }, select: { name: true } }) : null;
  const isLoggedIn = Boolean(user);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-ocean">Japan</span> Career &amp; Living
            </Link>
            <nav className="hidden gap-6 text-sm md:flex">
              <Link href="/jobs">Jobs</Link>
              <Link href="/companies">Companies</Link>
              <Link href="/locations">Locations</Link>
              <Link href="/calculators">Calculators</Link>
              <Link href="/resources">Resources</Link>
            </nav>
            <div className="flex gap-2">
              {isLoggedIn ? (
                <>
                  <span className="self-center px-1 text-sm font-semibold text-slate-700">{user?.name ?? "User"}</span>
                  <Link className="btn btn-primary text-sm" href="/dashboard">Dashboard</Link>
                  <form action="/api/auth/logout" method="POST">
                    <button className="btn btn-quiet text-sm" type="submit">Log out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link className="btn btn-quiet text-sm" href="/login">Log in</Link>
                  <Link className="btn btn-primary text-sm" href="/signup">Get started</Link>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-20 border-t bg-white">
          <div className="container flex flex-col justify-between gap-4 py-8 text-sm text-slate-500 md:flex-row">
            <p>© 2026 Japan Career &amp; Living Assistant. Fictional demo data for planning purposes.</p>
            <div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
