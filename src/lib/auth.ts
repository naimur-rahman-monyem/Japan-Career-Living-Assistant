import { cookies } from "next/headers";
import { createHmac } from "crypto";
const secret = () => process.env.AUTH_SECRET || "development-only-secret";
export function sign(value: string) { return `${value}.${createHmac("sha256", secret()).update(value).digest("hex")}`; }
export function verify(token?: string) { if (!token) return null; const [value, hash] = token.split("."); if (!value || !hash) return null; const expected = createHmac("sha256", secret()).update(value).digest("hex"); return hash === expected ? value : null; }
export function currentUserId() { return verify(cookies().get("jcla_session")?.value); }
