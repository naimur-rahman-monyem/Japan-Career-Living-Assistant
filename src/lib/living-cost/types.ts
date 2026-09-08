export type LivingCostItemRecord = {
  id: string;
  category: string;
  item: string;
  price: number;
  range: string | null;
};

export type LivingCostBreakdown = {
  rent: number;
  food: number;
  transportation: number;
  utilities: number;
  internet: number;
  mobile: number;
  entertainment: number;
};

export type LivingCostSummary = {
  city: string;
  currency: string;
  source: string;
  updatedAt: string;
  breakdown: LivingCostBreakdown;
  estimatedMonthlyCost: number;
  averageNetSalary: number | null;
  potentialRemainingIncome: number | null;
};

export type CitySummary = LivingCostSummary & { hasLivingCostData: boolean };
