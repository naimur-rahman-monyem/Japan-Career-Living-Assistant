"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
export default function Login() 
{ 
    const [error,setError]=useState(""); 
    const [submitting,setSubmitting]=useState(false); 
    async function submit(e:FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try{const data=Object.fromEntries(new FormData(e.currentTarget));
            const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
            if(r.ok){window.location.assign("/dashboard");
                return
            }
                setError("Email or password is incorrect.");
            }
            catch
            {
                setError("We could not sign you in. Please try again.");
            }
            finally
            {
                setSubmitting(false)
            }
        }
         return <main className="container flex min-h-[calc(100vh-9rem)] items-center py-8 sm:py-12">
            <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] lg:grid-cols-[.92fr_1.08fr]">
            <section aria-label="Mount Fuji at a Japanese lake" className="relative min-h-64 overflow-hidden bg-slate-900 lg:min-h-[620px]" role="img" style={{backgroundImage:"url('/images/mount-fuji-auth.jpg')",backgroundPosition:"center",backgroundSize:"cover"}}><div aria-hidden="true" className="absolute inset-0 bg-slate-950/40"/><div aria-hidden="true" className="absolute bottom-0 left-8 top-8 w-1 bg-red-500 lg:left-10 lg:top-10"/><div className="absolute bottom-8 left-8 right-8 text-white lg:bottom-12 lg:left-12 lg:right-12"><p className="text-sm font-bold tracking-[0.18em] text-slate-100">JAPAN CAREER &amp; LIVING</p><h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">A thoughtful start to your next chapter.</h2><div className="mt-6 h-px w-16 bg-red-400"/></div></section><section className="flex min-h-[520px] items-center px-6 py-10 sm:px-12 lg:px-16"><div className="mx-auto w-full max-w-md"><div className="flex items-center gap-3"><span aria-hidden="true" className="h-8 w-1 bg-red-500"/><p className="text-sm font-bold tracking-[0.16em] text-ocean">WELCOME BACK</p></div><h1 className="mt-5 text-4xl font-bold text-slate-900">Continue your plan.</h1><p className="mt-3 text-base leading-7 text-slate-600">Sign in to review your career path, saved roles, and move-to-Japan preparations.</p><form onSubmit={submit} aria-busy={submitting} className="mt-9 space-y-5"><label className="block text-sm font-bold text-slate-700"><span>Email address</span><input name="email" type="email" autoComplete="email" required disabled={submitting} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ocean focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"/></label><label className="block text-sm font-bold text-slate-700"><span>Password</span><input name="password" type="password" autoComplete="current-password" required disabled={submitting} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ocean focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"/></label>{error&&<p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700" role="alert">{error}</p>}<button className="btn btn-primary w-full rounded-md py-3 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting?"Signing in...":"Log in"}</button></form><p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">New here? <Link className="font-bold text-ocean hover:underline" href="/signup">Create an account</Link></p></div></section></div></main> }
