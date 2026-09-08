import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
import { jobMatches, readinessBreakdown, readinessRecommendations, readinessScore } from "@/lib/calculators";
import { getLivingCostCity } from "@/lib/living-cost/queries";

export const dynamic = "force-dynamic";

const defaultSkills = ["C#", "Java", "Python", "SQL", "Next.js", "ASP.NET"];

function average(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export default async function Dashboard() {
  const id = currentUserId();
  if (!id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: { include: { JapaneseLevel: true } },
      UserSkill: { include: { skill: true } },
      savedJobs: { include: { job: { include: { company: true, location: true } } }, orderBy: { createdAt: "desc" }, take: 3 },
    },
  });
  if (!user || !user.profile) redirect("/login");

  const profile = user.profile;
  const japaneseLevel = profile.JapaneseLevel?.code ?? "N3";
  const skills = user.UserSkill.length > 0 ? user.UserSkill.map(({ skill }) => skill.name) : defaultSkills;
  const breakdown = readinessBreakdown({
    japaneseLevel,
    experienceYears: profile.experienceYears,
    skills,
    hasPortfolio: Boolean(profile.bio),
  });
  const overallReadiness = average(Object.values(breakdown));
  const matches = jobMatches(skills);
  const recommendations = readinessRecommendations(breakdown, japaneseLevel, Boolean(profile.bio));
  const score = readinessScore({ japaneseLevel, experienceYears: profile.experienceYears, savings: profile.budget, hasPlan: true });
  const livingCost = await getLivingCostCity(profile.targetCity);

  return <main className="container py-12">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-sm font-semibold text-ocean">YOUR WORKSPACE</p><h1 className="mt-2 text-4xl font-bold">Good morning, {user.name.split(" ")[0]}.</h1><p className="mt-2 text-slate-600">Small, consistent steps make a big move feel manageable.</p><Link href="/dashboard/profile" className="mt-3 inline-block text-sm font-bold text-ocean">Update skills and strengths →</Link></div>
      <Link href="/calculators" className="btn btn-primary">Update my numbers</Link>
    </div>

    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <div className="card p-6 md:col-span-2"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">READINESS SCORE</p><p className="mt-3 text-5xl font-bold text-ocean">{score}<span className="text-xl text-slate-400">/100</span></p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">On track</span></div><div className="mt-7 h-3 rounded-full bg-slate-100"><div style={{ width: `${score}%` }} className="h-3 rounded-full bg-ocean" /></div><p className="mt-4 text-sm text-slate-500">Complete your language and budget details to make this score more precise.</p></div>
      <div className="card bg-[#fff6f8] p-6"><p className="text-sm font-semibold text-slate-500">TARGET CITY</p><p className="mt-4 text-2xl font-bold">{profile.targetCity}</p><p className="mt-1 text-sm text-slate-600">{profile.visaGoal}</p><Link href="/explore" className="mt-8 inline-block text-sm font-bold text-ocean">Explore pathways →</Link></div>
    </div>

    <section className="card mt-8 p-7"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="font-semibold text-ocean">LIVING COST SNAPSHOT</p><h2 className="mt-2 text-2xl font-bold">{profile.targetCity}</h2><p className="mt-2 text-sm text-slate-500">{livingCost?.summary ? "Estimated from the imported city dataset." : "Choose a city with imported living-cost data to see an estimate."}</p></div><Link href={`/living-cost?city=${encodeURIComponent(profile.targetCity)}`} className="btn btn-primary">View living costs</Link></div>{livingCost?.summary && <div className="mt-6 grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-slate-500">Monthly cost</p><p className="mt-1 text-xl font-bold">¥{livingCost.summary.estimatedMonthlyCost.toLocaleString()}</p></div><div><p className="text-sm text-slate-500">Average net salary</p><p className="mt-1 text-xl font-bold">¥{livingCost.summary.averageNetSalary?.toLocaleString() ?? "Unavailable"}</p></div><div><p className="text-sm text-slate-500">Potential remaining income</p><p className={`mt-1 text-xl font-bold ${(livingCost.summary.potentialRemainingIncome ?? 0) < 0 ? "text-red-600" : "text-emerald-600"}`}>¥{livingCost.summary.potentialRemainingIncome?.toLocaleString() ?? "Unavailable"}</p></div></div>}</section>

    <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div className="card p-7">
        <div className="flex items-end justify-between gap-4"><div><p className="font-semibold text-ocean">PERSONALIZED FOR YOU</p><h2 className="mt-2 text-2xl font-bold">Job Matching</h2><p className="mt-2 text-sm text-slate-500">Based on your {skills.length} technical skills and {profile.experienceYears} years of experience.</p></div><Link href="/jobs" className="text-sm font-bold text-ocean">View jobs →</Link></div>
        <div className="mt-6 space-y-4">{matches.map((job) => <div className="rounded-xl border border-slate-200 p-4" key={job.title}><div className="flex items-center justify-between gap-4"><div><p className="text-2xl font-bold text-ocean">{job.match}% <span className="text-sm font-normal text-slate-500">Match</span></p><h3 className="mt-1 font-bold">{job.title}</h3></div><div className="hidden text-right text-xs text-slate-500 sm:block">{job.skills.filter((skill) => skills.includes(skill)).length}/{job.skills.length} skills</div></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div style={{ width: `${job.match}%` }} className="h-2 rounded-full bg-ocean" /></div></div>)}</div><Link href="/dashboard/matches" className="mt-6 inline-block text-sm font-bold text-ocean">See personalized job matches →</Link>
      </div>

      <div className="card p-7"><p className="font-semibold text-ocean">YOUR NEXT ADVANTAGE</p><div className="mt-2 flex items-end justify-between"><h2 className="text-2xl font-bold">Japan Job Readiness</h2><span className="text-3xl font-bold text-ocean">{overallReadiness}%</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div style={{ width: `${overallReadiness}%` }} className="h-full rounded-full bg-ocean" /></div><div className="mt-7 space-y-4">{([ ["Technical Skills", breakdown.technical], ["Japanese", breakdown.japanese], ["Experience", breakdown.experience], ["Education", breakdown.education], ["Portfolio", breakdown.portfolio] ] as const).map(([label, value]) => <div key={label}><div className="flex justify-between text-sm"><span>{label}</span><span className="font-bold">{value}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div style={{ width: `${value}%` }} className="h-2 rounded-full bg-emerald-500" /></div></div>)}</div></div>
    </section>

    <section className="mt-8 rounded-2xl bg-ink p-7 text-white"><p className="text-sm font-semibold text-slate-300">RECOMMENDED NEXT STEPS</p><div className="mt-4 grid gap-3 md:grid-cols-3">{recommendations.map((recommendation) => <div className="rounded-xl border border-white/15 bg-white/5 p-4" key={recommendation}>{recommendation}</div>)}</div></section>

    <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div className="card p-7"><div className="flex items-center justify-between gap-4"><div><p className="font-semibold text-ocean">YOUR SHORTLIST</p><h2 className="mt-2 text-2xl font-bold">Saved jobs</h2></div><Link href="/dashboard/saved-jobs" className="text-sm font-bold text-ocean">View all →</Link></div><div className="mt-5 space-y-3">{user.savedJobs.length ? user.savedJobs.map(({ job }) => <Link className="block rounded-xl border border-slate-200 p-4 hover:border-ocean" href={`/jobs/${job.slug}`} key={job.id}><h3 className="font-bold">{job.title}</h3><p className="mt-1 text-sm text-slate-500">{job.company.name} · {job.location.name}</p></Link>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No saved jobs yet. <Link className="font-bold text-ocean" href="/jobs">Explore jobs →</Link></p>}</div></div>
      <div className="card p-7"><p className="font-semibold text-ocean">LANGUAGE PROGRESS</p><h2 className="mt-2 text-2xl font-bold">Japanese level</h2><div className="mt-6 flex items-center gap-5"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4ff] text-2xl font-bold text-ocean">{japaneseLevel}</div><div><p className="font-semibold">{profile.JapaneseLevel?.label ?? `JLPT ${japaneseLevel}`}</p><p className="mt-1 text-sm text-slate-500">Keep building toward N2 for more opportunities.</p></div></div><Link href="/japanese" className="mt-7 inline-block text-sm font-bold text-ocean">Practice Japanese →</Link></div>
    </section>

    <section className="mt-10"><h2 className="text-2xl font-bold">Your next three steps</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{["Confirm your target visa route", "Save three roles that fit your profile", "Build a weekly Japanese study habit"].map((step, index) => <div className="card p-5" key={step}><p className="text-sm font-bold text-ocean">0{index + 1}</p><p className="mt-3 font-semibold">{step}</p></div>)}</div></section>
  </main>;
}
