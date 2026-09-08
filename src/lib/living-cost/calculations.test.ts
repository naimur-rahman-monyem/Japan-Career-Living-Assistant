import { describe, expect, it } from "vitest";
import { calculateMonthlyCost, calculatePotentialRemainingIncome, getCostBreakdown } from "./calculations";

const items = [
  ["Rent Per Month", "1 Bedroom Apartment Outside of City Centre", 80000],
  ["Restaurants", "Meal at an Inexpensive Restaurant", 1000],
  ["Transportation", "Monthly Public Transport Pass (Regular Price)", 5000],
  ["Utilities (Monthly)", "Basic Utilities for 915 Square Feet Apartment (Electricity, Heating, Cooling, Water, Garbage)", 22000],
  ["Utilities (Monthly)", "Broadband Internet (Unlimited Data, 60 Mbps or Higher)", 5000],
  ["Utilities (Monthly)", "Mobile Phone Plan (Monthly, with Calls and 10GB+ Data)", 4000],
  ["Sports And Leisure", "Cinema Ticket (International Release)", 2000],
].map(([category, item, price], index) => ({ id: String(index), category: String(category), item: String(item), price: Number(price), range: null }));

describe("living-cost calculations", () => {
  it("builds a transparent monthly breakdown from raw items", () => {
    const breakdown = getCostBreakdown(items);
    expect(breakdown).toEqual({ rent: 80000, food: 30000, transportation: 5000, utilities: 22000, internet: 5000, mobile: 4000, entertainment: 8000 });
    expect(calculateMonthlyCost(breakdown!)).toBe(154000);
  });

  it("calculates remaining income and handles missing salary", () => {
    expect(calculatePotentialRemainingIncome(355347, 154000)).toBe(201347);
    expect(calculatePotentialRemainingIncome(null, 154000)).toBeNull();
  });

  it("returns no breakdown when a required monthly item is missing", () => {
    expect(getCostBreakdown(items.slice(0, -1))).toBeNull();
  });
});