"use client";

import { useState } from "react";
import Link from "next/link";

export default function SaveJobButton({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "login">("idle");

  async function saveJob() {
    setStatus("saving");
    const response = await fetch("/api/saved-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    if (response.status === 401) {
      setStatus("login");
      return;
    }

    setStatus(response.ok ? "saved" : "error");
  }

  if (status === "login") {
    return <p className="mt-8 text-sm text-slate-600">Please <Link className="font-bold text-ocean" href="/login">log in</Link> to save this job.</p>;
  }

  return <div className="mt-8 flex flex-wrap items-center gap-3">
    <button className="btn btn-primary" type="button" onClick={saveJob} disabled={status === "saving" || status === "saved"}>
      {status === "saving" ? "Saving..." : status === "saved" ? "Job saved" : "Save this job"}
    </button>
    {status === "error" && <p className="text-sm text-red-600">We could not save this job. Please try again.</p>}
    {status === "saved" && <Link className="text-sm font-bold text-ocean" href="/dashboard">View dashboard →</Link>}
  </div>;
}
