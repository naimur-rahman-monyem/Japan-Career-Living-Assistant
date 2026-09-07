"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  targetCity: string;
  japaneseLevel: string;
  experienceYears: number;
  skills: string[];
  bio: string;
};

export default function ProfileForm({ targetCity, japaneseLevel, experienceYears, skills, bio }: ProfileFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetCity: form.get("targetCity"),
        japaneseLevel: form.get("japaneseLevel"),
        experienceYears: form.get("experienceYears"),
        skills: String(form.get("skills") ?? "").split(","),
        bio: form.get("bio"),
      }),
    });
    setSaving(false);
    if (!response.ok) {
      setError(await response.text());
      return;
    }
    setMessage("Profile saved. Your job matches have been updated.");
    router.refresh();
  }

  return <form onSubmit={submit} className="card mt-8 space-y-5 p-7">
    <div><label className="text-sm font-bold text-slate-600" htmlFor="targetCity">Target city</label><input id="targetCity" name="targetCity" defaultValue={targetCity} required className="mt-2 w-full rounded-lg border p-3" /></div>
    <div><label className="text-sm font-bold text-slate-600" htmlFor="japaneseLevel">Japanese level</label><select id="japaneseLevel" name="japaneseLevel" defaultValue={japaneseLevel} className="mt-2 w-full rounded-lg border p-3"><option value="N5">N5</option><option value="N4">N4</option><option value="N3">N3</option><option value="N2">N2</option><option value="N1">N1</option><option value="Business">Business</option></select></div>
    <div><label className="text-sm font-bold text-slate-600" htmlFor="experienceYears">Years of experience</label><input id="experienceYears" name="experienceYears" type="number" min="0" max="50" defaultValue={experienceYears} required className="mt-2 w-full rounded-lg border p-3" /></div>
    <div><label className="text-sm font-bold text-slate-600" htmlFor="skills">Skills</label><input id="skills" name="skills" defaultValue={skills.join(", ")} placeholder="Python, SQL, Next.js" className="mt-2 w-full rounded-lg border p-3" /><p className="mt-1 text-xs text-slate-500">Separate each skill with a comma.</p></div>
    <div><label className="text-sm font-bold text-slate-600" htmlFor="bio">What are you good at?</label><textarea id="bio" name="bio" defaultValue={bio} rows={4} placeholder="Describe your strengths, projects, and the work you enjoy." className="mt-2 w-full rounded-lg border p-3" /></div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    {message && <p className="text-sm text-emerald-700">{message}</p>}
    <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile and update matches"}</button>
  </form>;
}
