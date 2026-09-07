import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:{slug:string}}){const job=await db.job.findUnique({where:{slug:params.slug},include:{company:true,location:true,category:true,skills:true}});return job?NextResponse.json(job):NextResponse.json({error:"Not found"},{status:404})}
