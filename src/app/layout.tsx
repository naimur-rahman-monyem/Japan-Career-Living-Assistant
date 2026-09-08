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
  const user = userId ? await db.user.findUnique({ where: { id: userId }, select: { name: true, role: true } }) : null;
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
              {user?.role === "ADMIN" ? <Link className="font-bold text-ocean" href="/admin">Control center</Link> : <>
                <Link href="/jobs">Jobs</Link>
                <Link href="/companies">Companies</Link>
                <Link href="/locations">Locations</Link>
                <Link href="/calculators">Calculators</Link>
                <Link href="/living-cost">Living Cost</Link>
                <Link href="/resources">Resources</Link>
              </>}
            </nav>
            <div className="flex gap-2">
              {isLoggedIn ? (
                <>
                  <span className="self-center px-2 text-base font-bold text-slate-800 sm:text-lg">{user?.name}</span>{user?.role === "ADMIN" && <Link className="btn btn-quiet text-sm" href="/admin">Admin</Link>}
                  {user?.role !== "ADMIN" && <>
<Link className="btn btn-primary gap-2 text-sm" href="/dashboard" title="Open dashboard" aria-label="Open dashboard">
                    <span aria-hidden="true" className="grid grid-cols-2 gap-0.5"><span className="h-1.5 w-1.5 rounded-sm bg-current"/><span className="h-1.5 w-1.5 rounded-sm bg-current"/><span className="h-1.5 w-1.5 rounded-sm bg-current"/><span className="h-1.5 w-1.5 rounded-sm bg-current"/></span>
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>                  </>}
                  <form action="/api/auth/logout" method="POST">
                    <button className="btn btn-quiet gap-2 text-sm" type="submit" title="Log out" aria-label="Log out">
                      <span aria-hidden="true" className="text-base">↪</span>
                      <span className="hidden sm:inline">Log out</span>
                    </button>
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
