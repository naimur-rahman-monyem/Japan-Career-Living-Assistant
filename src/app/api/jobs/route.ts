import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(req:Request){const {searchParams}=new URL(req.url);const q=searchParams.get("q")||undefined;const jobs=await db.job.findMany({where:q?{OR:[{title:{contains:q,mode:"insensitive"}},{description:{contains:q,mode:"insensitive"}}]}:undefined,include:{company:true,location:true,category:true},orderBy:{createdAt:"desc"}});return NextResponse.json(jobs)}
