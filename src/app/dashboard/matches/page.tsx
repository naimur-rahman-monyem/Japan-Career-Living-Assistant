import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLivingCostCities } from "@/lib/living-cost/queries";

export const dynamic = "force-dynamic";

const languageRank: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5, Business: 5 };
const defaultSkills = ["C#", "Java", "Python", "SQL", "Next.js", "ASP.NET"];

function matchJob(job: { skills: { name: string }[]; location: { name: string }; visaSupport: boolean; minSalary: number }, userSkills: string[], japaneseLevel: string, experienceYears: number, targetCity: string, monthlyCost?: number) {
  const skillSet = new Set(userSkills.map((skill) => skill.toLowerCase()));
  const skillScore = job.skills.length === 0 ? 10 : Math.round((job.skills.filter((skill) => skillSet.has(skill.name.toLowerCase())).length / job.skills.length) * 55);
  const cityScore = job.location.name.toLowerCase() === targetCity.toLowerCase() ? 15 : 0;
  const visaScore = job.visaSupport ? 10 : 0;
  const languageScore = (languageRank[japaneseLevel] ?? 1) >= 3 ? 10 : 5;
  const experienceScore = experienceYears > 0 ? 10 : 5;
  const financialScore = monthlyCost ? Math.max(0, Math.min(5, Math.round((job.minSalary / 12 - monthlyCost) / 100000))) : 0;
  return Math.min(100, skillScore + cityScore + visaScore + languageScore + experienceScore + financialScore);
}

export default async function PersonalizedMatches() {
  const userId = currentUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: { include: { JapaneseLevel: true } },
      UserSkill: { include: { skill: true } },
    },
  });
  if (!user || !user.profile) redirect("/login");

  const [jobs, livingCostCities] = await Promise.all([db.job.findMany({ include: { company: true, location: true, category: true, skills: true }, orderBy: { createdAt: "desc" } }), getLivingCostCities()]);
  const costsByCity = new Map(livingCostCities.map((city) => [city.city, city]));
  const userSkills = user.UserSkill.length > 0 ? user.UserSkill.map(({ skill }) => skill.name) : defaultSkills;
  const japaneseLevel = user.profile.JapaneseLevel?.code ?? "N3";
  const rankedJobs = jobs.map((job) => ({ job, match: matchJob(job, userSkills, japaneseLevel, user.profile!.experienceYears, user.profile!.targetCity, costsByCity.get(job.location.name)?.estimatedMonthlyCost) })).sort((a, b) => b.match - a.match);

  return <main className="container py-16">
    <Link href="/dashboard" className="text-sm font-bold text-ocean">← Dashboard</Link>
    <p className="mt-8 font-semibold text-ocean">PERSONALIZED FOR YOU</p>
    <h1 className="mt-3 max-w-2xl text-4xl font-bold">Jobs that fit your profile</h1>
    <p className="mt-4 max-w-2xl text-lg text-slate-600">Ranked using your skills, {japaneseLevel} Japanese level, experience, target city, and visa support.</p>
    <div className="mt-10 space-y-4">{rankedJobs.length ? rankedJobs.map(({ job, match }) => <Link href={`/jobs/${job.slug}`} className="card block p-6 hover:border-ocean" key={job.id}><div className="flex flex-col justify-between gap-4 md:flex-row"><div><p className="text-3xl font-bold text-ocean">{match}% <span className="text-sm font-normal text-slate-500">Match</span></p><h2 className="mt-1 text-xl font-bold">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.company.name} · {job.location.name}</p></div><div className="text-sm text-slate-500"><p>{job.skills.length ? `${job.skills.map((skill) => skill.name).join(", ")}` : "Skills to be discussed"}</p><p className="mt-2 font-semibold text-ocean">{job.visaSupport ? "Visa support" : "Check visa fit"}</p>{costsByCity.get(job.location.name)?.hasLivingCostData && <p className="mt-1">Est. cost ¥{costsByCity.get(job.location.name)!.estimatedMonthlyCost.toLocaleString()}/mo</p>}</div></div><div className="mt-4 h-2 rounded-full bg-slate-100"><div style={{ width: `${match}%` }} className="h-2 rounded-full bg-ocean" /></div></Link>) : <p className="card p-6">No jobs are available yet. Check back soon.</p>}</div>
  </main>;
}
