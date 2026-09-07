import { NextResponse } from "next/server"; import { z } from "zod"; import { monthlyLivingCost, readinessScore } from "@/lib/calculators";
const schema=z.object({city:z.string(),rent:z.number().int().positive(),lifestyle:z.enum(["lean","balanced","comfortable"]).default("balanced")});
export async function POST(req:Request){const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:"Invalid inputs"},{status:400});return NextResponse.json({monthlyCost:monthlyLivingCost(p.data.city,p.data.rent,p.data.lifestyle)})}
export async function GET(){return NextResponse.json({cities:["Tokyo","Osaka","Fukuoka"],lifestyles:["lean","balanced","comfortable"]})}
