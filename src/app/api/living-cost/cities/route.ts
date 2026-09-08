import { NextResponse } from "next/server";
import { getLivingCostCities } from "@/lib/living-cost/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getLivingCostCities());
  } catch {
    return NextResponse.json({ error: "Living-cost data is currently unavailable." }, { status: 503 });
  }
}
