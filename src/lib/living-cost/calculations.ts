import type { LivingCostBreakdown, LivingCostItemRecord, LivingCostSummary } from "./types";

const itemPrice = (items: LivingCostItemRecord[], category: string, item: string) =>
  items.find((entry) => entry.category === category && entry.item === item)?.price ?? null;

export function getCostBreakdown(items: LivingCostItemRecord[]): LivingCostBreakdown | null {
  const rent = itemPrice(items, "Rent Per Month", "1 Bedroom Apartment Outside of City Centre");
  const meal = itemPrice(items, "Restaurants", "Meal at an Inexpensive Restaurant");
  const transportation = itemPrice(items, "Transportation", "Monthly Public Transport Pass (Regular Price)");
  const utilities = itemPrice(items, "Utilities (Monthly)", "Basic Utilities for 915 Square Feet Apartment (Electricity, Heating, Cooling, Water, Garbage)");
  const internet = itemPrice(items, "Utilities (Monthly)", "Broadband Internet (Unlimited Data, 60 Mbps or Higher)");
  const mobile = itemPrice(items, "Utilities (Monthly)", "Mobile Phone Plan (Monthly, with Calls and 10GB+ Data)");
  const cinema = itemPrice(items, "Sports And Leisure", "Cinema Ticket (International Release)");

  const required = [rent, meal, transportation, utilities, internet, mobile, cinema];
  if (required.some((value) => value === null)) return null;
  const [rentValue, mealValue, transportationValue, utilitiesValue, internetValue, mobileValue, cinemaValue] = required as number[];

  return {
    rent: rentValue,
    food: mealValue * 30,
    transportation: transportationValue,
    utilities: utilitiesValue,
    internet: internetValue,
    mobile: mobileValue,
    entertainment: cinemaValue * 4,
  };
}

export function calculateMonthlyCost(breakdown: LivingCostBreakdown) {
  return Math.round(Object.values(breakdown).reduce((total, value) => total + value, 0));
}

export function calculatePotentialRemainingIncome(netSalary: number | null, monthlyCost: number) {
  return netSalary === null ? null : Math.round(netSalary - monthlyCost);
}

export function getCitySummary(city: { city: string; currency: string; source: string; updatedAt: Date; items: LivingCostItemRecord[] }): LivingCostSummary | null {
  const breakdown = getCostBreakdown(city.items);
  if (!breakdown) return null;
  const averageNetSalary = itemPrice(city.items, "Salaries And Financing", "Average Monthly Net Salary (After Tax)");
  const estimatedMonthlyCost = calculateMonthlyCost(breakdown);
  return {
    city: city.city,
    currency: city.currency,
    source: city.source,
    updatedAt: city.updatedAt.toISOString(),
    breakdown,
    estimatedMonthlyCost,
    averageNetSalary,
    potentialRemainingIncome: calculatePotentialRemainingIncome(averageNetSalary, estimatedMonthlyCost),
  };
}
