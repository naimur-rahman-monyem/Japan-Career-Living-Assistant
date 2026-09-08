"use client";
import { useEffect, useState } from "react";

type Costs = {
	rent: number;
	food: number;
	transportation: number;
	utilities: number;
	internet: number;
	mobile: number;
	entertainment: number;
};

type CitySummary = { city: string; breakdown: Costs; estimatedMonthlyCost: number; averageNetSalary: number | null };
const initialCosts: Costs = { rent: 90000, food: 40000, transportation: 15000, utilities: 12000, internet: 5000, mobile: 4000, entertainment: 20000 };
const costFields: { key: keyof Costs; label: string }[] = [
	{ key: "rent", label: "Rent" }, { key: "food", label: "Food" },
	{ key: "transportation", label: "Transportation" }, { key: "utilities", label: "Utilities" },
	{ key: "internet", label: "Internet" }, { key: "mobile", label: "Mobile" }, { key: "entertainment", label: "Entertainment & other" },
];

export default function Calculators() {
	const [location, setLocation] = useState("Tokyo");
	const [salary, setSalary] = useState(300000);
	const [costs, setCosts] = useState<Costs>(initialCosts);
	const [cities, setCities] = useState<CitySummary[]>([]);
	const totalCosts = Object.values(costs).reduce((total, cost) => total + cost, 0);
	const remaining = salary - totalCosts;

	useEffect(() => {
		const requestedCity = new URLSearchParams(window.location.search).get("city");
		fetch("/api/living-cost/cities").then((response) => response.ok ? response.json() : []).then((data: CitySummary[]) => {
			setCities(data);
			const selected = data.find((city) => city.city.toLowerCase() === (requestedCity ?? "Tokyo").toLowerCase()) ?? data[0];
			if (selected?.averageNetSalary) setSalary(Math.round(selected.averageNetSalary));
			if (selected?.breakdown) setCosts(selected.breakdown);
			if (selected?.city) setLocation(selected.city);
		}).catch(() => undefined);
	}, []);

	function updateCost(key: keyof Costs, value: string) {
		setCosts((current) => ({ ...current, [key]: Number(value) || 0 }));
	}

	return <main className="container py-16">
		<p className="font-semibold text-ocean">PLAN WITH CLARITY</p>
		<h1 className="mt-3 text-4xl font-bold">Japan cost calculator</h1>
		<p className="mt-4 text-lg text-slate-600">Enter your monthly income and expected costs in Japanese yen.</p>
		<div className="mt-10 grid gap-6 md:grid-cols-[1fr_1fr]">
			<div className="card space-y-5 p-7">
				<label className="block font-semibold">Location
					<select value={location} onChange={(event) => { const selected = cities.find((city) => city.city === event.target.value); setLocation(event.target.value); if (selected?.averageNetSalary) setSalary(Math.round(selected.averageNetSalary)); if (selected?.breakdown) setCosts(selected.breakdown); }} className="mt-2 w-full rounded-lg border p-3">{(cities.length ? cities.map((city) => <option key={city.city}>{city.city}</option>) : <option>Tokyo</option>)}</select>
				</label>
				<label className="block font-semibold">Monthly salary
					<input type="number" min="0" step="1000" value={salary} onChange={(event) => setSalary(Number(event.target.value) || 0)} className="mt-2 w-full rounded-lg border p-3" />
				</label>
				{costFields.map(({ key, label }) => <label className="block font-semibold" key={key}>{label}
					<div className="mt-2 flex items-center rounded-lg border px-3"><span className="text-slate-500">¥</span><input type="number" min="0" step="1000" value={costs[key]} onChange={(event) => updateCost(key, event.target.value)} className="w-full border-0 p-3 outline-none" /></div>
				</label>)}
			</div>
			<div className="rounded-2xl bg-ink p-8 text-white">
				<p className="text-sm text-slate-300">MONTHLY PLAN FOR {location.toUpperCase()}</p>
				<p className="mt-5 text-sm text-slate-300">Monthly salary</p><p className="text-3xl font-bold">¥{salary.toLocaleString()}</p>
				<p className="mt-6 text-sm text-slate-300">Total monthly costs</p><p className="text-3xl font-bold">¥{totalCosts.toLocaleString()}</p>
				<div className="mt-8 border-t border-white/20 pt-5"><p className="text-sm text-slate-300">Money left each month</p><p className={`mt-1 text-4xl font-bold ${remaining < 0 ? "text-red-300" : "text-emerald-300"}`}>¥{remaining.toLocaleString()}</p></div>
				<p className="mt-5 text-sm text-slate-300">This estimate helps you compare your income with your planned monthly living costs.</p>
			</div>
		</div>
	</main>;
}
