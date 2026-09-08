import { NextResponse } from "next/server";
import { getLivingCostCities } from "@/lib/living-cost/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const names = new URL(request.url).searchParams.get("cities")?.split(",").map((city) => city.trim()).filter(Boolean) ?? [];
  if (names.length < 2 || names.length > 4) return NextResponse.json({ error: "Choose between 2 and 4 cities to compare." }, { status: 400 });
  const cities = await getLivingCostCities();
  const selected = cities.filter((city) => names.some((name) => name.toLowerCase() === city.city.toLowerCase()));
  if (selected.length !== names.length) return NextResponse.json({ error: "One or more selected cities are unavailable." }, { status: 404 });
  return NextResponse.json(selected);
}
