export function monthlyLivingCost(city: string, rent: number, lifestyle: "lean"|"balanced"|"comfortable" = "balanced") {
  const factor = lifestyle === "lean" ? .82 : lifestyle === "comfortable" ? 1.28 : 1;
  const cityFactor = city === "Tokyo" ? 1.1 : city === "Osaka" ? .92 : .84;
  return Math.round((rent + 70000) * factor * cityFactor);
}
export function readinessScore(input: { japaneseLevel: string; experienceYears: number; savings: number; hasPlan: boolean }) {
  const language: Record<string, number> = { N5: 8, N4: 14, N3: 22, N2: 29, N1: 34, Business: 36 };
  return Math.min(100, (language[input.japaneseLevel] ?? 10) + Math.min(28, input.experienceYears * 5) + Math.min(25, Math.floor(input.savings / 100000) * 5) + (input.hasPlan ? 13 : 0));
}

export type ReadinessBreakdown = {
  technical: number;
  japanese: number;
  experience: number;
  education: number;
  portfolio: number;
};

export type JobMatch = {
  title: string;
  match: number;
  skills: string[];
};

const roleSkills: JobMatch[] = [
  { title: "Software Engineer", match: 87, skills: ["C#", "Java", "Python", "SQL", "Next.js", "ASP.NET"] },
  { title: "Backend Developer", match: 72, skills: ["C#", "Java", "Python", "SQL", "ASP.NET"] },
  { title: "IT Support Engineer", match: 68, skills: ["SQL", "Python", "C#"] },
];

export function jobMatches(skills: string[]): JobMatch[] {
  const normalized = new Set(skills.map((skill) => skill.toLowerCase()));
  return roleSkills.map((role) => ({
    ...role,
    match: Math.min(99, Math.max(40, role.match + role.skills.filter((skill) => normalized.has(skill.toLowerCase())).length * 2)),
  }));
}

export function readinessBreakdown(input: { japaneseLevel: string; experienceYears: number; skills: string[]; hasPortfolio: boolean }): ReadinessBreakdown {
  const japanese: Record<string, number> = { N5: 25, N4: 40, N3: 60, N2: 80, N1: 95, Business: 90 };
  return {
    technical: Math.min(100, 45 + input.skills.length * 8),
    japanese: japanese[input.japaneseLevel] ?? 20,
    experience: Math.min(100, 45 + input.experienceYears * 20),
    education: 95,
    portfolio: input.hasPortfolio ? 80 : 35,
  };
}

export function readinessRecommendations(breakdown: ReadinessBreakdown, japaneseLevel: string, hasPortfolio: boolean): string[] {
  const recommendations: string[] = [];
  if (japaneseLevel === "N3") recommendations.push("Improve Japanese from N3 to N2.");
  if (!hasPortfolio || breakdown.portfolio < 60) recommendations.push("Add one production-level project.");
  if (breakdown.experience < 70) recommendations.push("Gain more backend experience.");
  return recommendations;
}
