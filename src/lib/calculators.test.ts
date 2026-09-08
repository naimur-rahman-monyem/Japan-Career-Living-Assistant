import { describe, expect, it } from "vitest";
import { jobMatches, monthlyLivingCost, readinessBreakdown, readinessRecommendations, readinessScore } from "./calculators";

describe("planning calculators", () => {
	it("adjusts cost by city and lifestyle", () => {
		expect(monthlyLivingCost("Tokyo", 90000, "comfortable")).toBeGreaterThan(monthlyLivingCost("Osaka", 90000, "lean"));
	});

	it("caps readiness at 100", () => {
		expect(readinessScore({ japaneseLevel: "N1", experienceYears: 20, savings: 1000000, hasPlan: true })).toBe(100);
	});

	it("ranks software roles for a technical skill profile", () => {
		const matches = jobMatches(["C#", "Java", "Python", "SQL", "Next.js", "ASP.NET"]);
		expect(matches.map(({ title }) => title)).toEqual(["Software Engineer", "Backend Developer", "IT Support Engineer"]);
		expect(matches[0].match).toBeGreaterThan(matches[1].match);
	});

	it("suggests improvements for an N3 early-career profile", () => {
		const breakdown = readinessBreakdown({ japaneseLevel: "N3", experienceYears: 0, skills: ["Python", "SQL"], hasPortfolio: false });
		expect(readinessRecommendations(breakdown, "N3", false)).toEqual([
			"Improve Japanese from N3 to N2.",
			"Add one production-level project.",
			"Gain more backend experience.",
		]);
	});
});
