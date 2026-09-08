"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CitySummary } from "@/lib/living-cost/types";

export default function CityComparisonChart({ cities }: { cities: CitySummary[] }) {
  const data = cities.filter((city) => city.hasLivingCostData).map((city) => ({
    city: city.city,
    cost: city.estimatedMonthlyCost,
    salary: city.averageNetSalary ?? 0,
    remaining: city.potentialRemainingIncome ?? 0,
  }));
  return <div className="h-80 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="#e5eaf2"/><XAxis dataKey="city" tick={{ fontSize: 12 }}/><YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `¥${Math.round(value / 1000)}k`}/><Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} /><Legend /><Bar dataKey="cost" name="Monthly cost" fill="#f08ca5" radius={[4, 4, 0, 0]}/><Bar dataKey="salary" name="Net salary" fill="#175cd3" radius={[4, 4, 0, 0]}/><Bar dataKey="remaining" name="Remaining income" fill="#10b981" radius={[4, 4, 0, 0]}/></BarChart></ResponsiveContainer></div>;
}
