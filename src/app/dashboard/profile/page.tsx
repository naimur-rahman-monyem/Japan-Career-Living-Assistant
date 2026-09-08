import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const id = currentUserId();
  if (!id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id },
    include: { profile: { include: { JapaneseLevel: true } }, UserSkill: { include: { skill: true } } },
  });
  if (!user || !user.profile) redirect("/login");

  return <main className="container max-w-2xl py-16">
    <p className="font-semibold text-ocean">YOUR DETAILS</p>
    <h1 className="mt-3 text-4xl font-bold">Build your job profile</h1>
    <p className="mt-3 text-slate-600">Tell us what you know and what you are good at. We will use it to rank the best jobs for you.</p>
    <div className="mt-8 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-slate-500">Name</p><p className="mt-1 font-semibold">{user.name}</p></div><div><p className="text-xs font-bold uppercase text-slate-500">Email</p><p className="mt-1 font-semibold">{user.email}</p></div></div>
    <ProfileForm targetCity={user.profile.targetCity} japaneseLevel={user.profile.JapaneseLevel?.code ?? "N3"} experienceYears={user.profile.experienceYears} skills={user.UserSkill.map(({ skill }) => skill.name)} bio={user.profile.bio ?? ""} />
  </main>;
}
