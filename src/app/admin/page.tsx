import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
import AdminUserManager from "./AdminUserManager";
import AdminContentManager from "./AdminContentManager";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const id = currentUserId();
  if (!id) redirect("/login");

  const administrator = await db.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (administrator?.role !== "ADMIN") redirect("/dashboard");

  const [users, resourcesCount, jobsCount, userRows, jobs, locations, resources, companies, categories] = await Promise.all([
    db.user.count(),
    db.resource.count(),
    db.job.count(),
    db.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
    db.job.findMany({ include: { company: { select: { name: true } }, location: { select: { name: true } }, category: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
    db.location.findMany({ include: { _count: { select: { jobs: true } } }, orderBy: { name: "asc" } }),
    db.resource.findMany({ orderBy: { title: "asc" } }),
    db.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.jobCategory.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return <main className="container py-12">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-sm font-bold text-ocean">ADMINISTRATION</p><h1 className="mt-2 text-4xl font-bold">Control center</h1><p className="mt-3 max-w-2xl text-slate-600">Manage members and the content shown across the public workspace.</p></div>
      <p className="text-sm font-semibold text-slate-500">Signed in as administrator</p>
    </div>
    <section className="mt-10 grid gap-4 sm:grid-cols-3">
      <div className="border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">Registered users</p><p className="mt-2 text-3xl font-bold text-ocean">{users}</p></div>
      <div className="border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">Job listings</p><p className="mt-2 text-3xl font-bold text-ocean">{jobsCount}</p></div>
      <div className="border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">Resources</p><p className="mt-2 text-3xl font-bold text-ocean">{resourcesCount}</p></div>
    </section>
    <AdminUserManager currentUserId={administrator.id} initialUsers={userRows.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))} />
    <AdminContentManager initialContent={{ jobs, locations, resources, companies, categories }} />
  </main>;
}