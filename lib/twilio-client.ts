import twilio from "twilio";
import { phoneKey } from "@/lib/phone-utils";

export { phoneKey } from "@/lib/phone-utils";

export const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER ?? "+18703958999";

export function getTwilioClient() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not configured");
  return twilio(sid, token);
}

/** Resolve uid from inbound phone via RTDB REST API (phoneIndex allows public read) */
export async function uidFromPhone(from: string): Promise<string | null> {
  const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!dbUrl) return null;
  const key = phoneKey(from);
  try {
    const res = await fetch(`${dbUrl}/phoneIndex/${key}.json`);
    if (!res.ok) return null;
    const uid = await res.json();
    return typeof uid === "string" ? uid : null;
  } catch {
    return null;
  }
}

/** Validate Twilio signature (optional but recommended in prod) */
export function validateSignature(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN ?? "";
  return twilio.validateRequest(token, signature, url, params);
}
