import { NextResponse } from "next/server";
import { getLivingCostCity } from "@/lib/living-cost/queries";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { city: string } }) {
  try {
    const result = await getLivingCostCity(decodeURIComponent(params.city));
    if (!result) return NextResponse.json({ error: "City living-cost data was not found." }, { status: 404 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Living-cost data is currently unavailable." }, { status: 503 });
  }
}
