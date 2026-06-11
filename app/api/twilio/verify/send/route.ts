import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient, TWILIO_PHONE, phoneKey } from "@/lib/twilio-client";
import { verifyIdToken, dbPut } from "@/lib/firebase-verify";

function e164(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: NextRequest) {
  const { phone, idToken } = await req.json() as { phone?: string; idToken?: string };

  if (!phone || !idToken) {
    return NextResponse.json({ error: "phone and idToken required" }, { status: 400 });
  }

  const uid = await verifyIdToken(idToken);
  if (!uid) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const to = e164(phone);
  const key = phoneKey(to);
  if (key.length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // 6-digit OTP
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store OTP in RTDB under user's path (auth-gated write)
  const stored = await dbPut(`users/${uid}/otpCode`, { code, phone: key, expiresAt }, idToken);
  if (!stored) {
    return NextResponse.json({ error: "Could not save verification code" }, { status: 500 });
  }

  // Send SMS
  try {
    const twilio = getTwilioClient();
    await twilio.messages.create({
      to,
      from: TWILIO_PHONE,
      body: `Your BRO2BRO verification code is: ${code}\n\nValid for 5 minutes. Don't share this code.`,
    });
  } catch (err) {
    console.error("Twilio send error:", err);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
