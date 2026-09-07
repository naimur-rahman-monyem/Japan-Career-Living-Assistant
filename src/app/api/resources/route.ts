import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(){const resources=await db.resource.findMany({orderBy:{featured:"desc"}});return NextResponse.json(resources)}
