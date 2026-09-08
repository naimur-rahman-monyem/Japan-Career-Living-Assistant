import Link from "next/link"; import { db } from "@/lib/db"; import { getLivingCostCities } from "@/lib/living-cost/queries";
export const dynamic="force-dynamic";
export default async function Jobs({ searchParams }: { searchParams: { q?: string; location?: string; company?: string } }) {
	const q = searchParams.q?.trim();
	const location = searchParams.location?.trim();
	const company = searchParams.company?.trim();
	const [jobs, livingCostCities] = await Promise.all([db.job.findMany({
		where: {
			...(location ? { location: { slug: location } } : {}),
			...(company ? { company: { slug: company } } : {}),
			...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
		},
		include: { company: true, location: true, category: true },
		orderBy: { createdAt: "desc" },
	}), getLivingCostCities()]);
	const costsByCity = new Map(livingCostCities.map((city) => [city.city, city]));
	return <main className="container py-16"><p className="font-semibold text-ocean">OPPORTUNITIES</p><h1 className="mt-3 text-4xl font-bold">Jobs that welcome global talent</h1><p className="mt-4 text-slate-600">Curated roles with transparent salary ranges and visa context.</p><div className="mt-10 space-y-4">{jobs.length ? jobs.map(j=>{const cityCost = costsByCity.get(j.location.name); return <Link href={`/jobs/${j.slug}`} className="card block p-6 hover:border-ocean" key={j.id}><div className="flex flex-col justify-between gap-3 md:flex-row"><div><h2 className="text-xl font-bold">{j.title}</h2><p className="mt-1 text-sm text-slate-500">{j.company.name} · {j.location.name} · {j.category.name}</p></div><p className="font-semibold text-ocean">¥{(j.minSalary/10000).toFixed(0)}–{(j.maxSalary/10000).toFixed(0)}万</p></div><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{j.visaSupport?"Visa support":"Check visa fit"}</span><span className="rounded-full bg-slate-100 px-3 py-1">{j.employmentType}</span>{cityCost?.hasLivingCostData && <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Est. living cost ¥{cityCost.estimatedMonthlyCost.toLocaleString()}/mo</span>}</div></Link>}) : <p className="card p-6 text-slate-600">No jobs match this search. Try another city or keyword.</p>}</div></main>;
}
