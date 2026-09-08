import { db } from "@/lib/db";
import { getCitySummary } from "./calculations";
import type { CitySummary, LivingCostItemRecord, LivingCostSummary } from "./types";

const itemSelect = { id: true, category: true, item: true, price: true, range: true } as const;

export async function getLivingCostCities(): Promise<CitySummary[]> {
  const cities = await db.livingCostCity.findMany({ include: { items: { select: itemSelect } }, orderBy: { city: "asc" } });
  return cities.map((city) => {
    const summary = getCitySummary(city as { city: string; currency: string; source: string; updatedAt: Date; items: LivingCostItemRecord[] });
    return summary ? { ...summary, hasLivingCostData: true } : {
      city: city.city,
      currency: city.currency,
      source: city.source,
      updatedAt: city.updatedAt.toISOString(),
      breakdown: { rent: 0, food: 0, transportation: 0, utilities: 0, internet: 0, mobile: 0, entertainment: 0 },
      estimatedMonthlyCost: 0,
      averageNetSalary: null,
      potentialRemainingIncome: null,
      hasLivingCostData: false,
    };
  });
}

export async function getLivingCostCity(cityName: string): Promise<{ summary: LivingCostSummary | null; items: LivingCostItemRecord[] } | null> {
  const city = await db.livingCostCity.findUnique({ where: { city: cityName }, include: { items: { select: itemSelect, orderBy: [{ category: "asc" }, { item: "asc" }] } } });
  if (!city) return null;
  return { summary: getCitySummary(city as { city: string; currency: string; source: string; updatedAt: Date; items: LivingCostItemRecord[] }), items: city.items };
}
