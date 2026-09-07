import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

const profileSchema = z.object({
  targetCity: z.string().min(1).max(80),
  japaneseLevel: z.enum(["N5", "N4", "N3", "N2", "N1", "Business"]),
  experienceYears: z.coerce.number().int().min(0).max(50),
  skills: z.array(z.string().trim().min(1).max(60)).max(30),
  bio: z.string().trim().max(1000),
});

export async function PATCH(req: Request) {
  const userId = currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check your profile details." }, { status: 400 });

  const level = await db.japaneseLevel.findUnique({ where: { code: parsed.data.japaneseLevel } });
  if (!level) return NextResponse.json({ error: "Japanese level is not available." }, { status: 400 });

  const uniqueSkills = Array.from(new Set(parsed.data.skills.map((skill) => skill.trim()).filter(Boolean)));
  await db.$transaction(async (transaction) => {
    await transaction.userProfile.update({
      where: { userId },
      data: {
        targetCity: parsed.data.targetCity,
        japaneseLevelId: level.id,
        experienceYears: parsed.data.experienceYears,
        bio: parsed.data.bio || null,
      },
    });
    await transaction.userSkill.deleteMany({ where: { userId } });
    for (const name of uniqueSkills) {
      const skill = await transaction.skill.upsert({
        where: { name },
        update: {},
        create: { name, category: "Technical" },
      });
      await transaction.userSkill.create({ data: { userId, skillId: skill.id } });
    }
  });

  return NextResponse.json({ ok: true });
}
