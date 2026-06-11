import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, dbGet, dbPatch, dbDelete, dbPutPublic } from "@/lib/firebase-verify";

interface OtpRecord {
  code: string;
  phone: string;  // digits only key
  expiresAt: number;
}

export async function POST(req: NextRequest) {
  const { code, idToken } = await req.json() as { code?: string; idToken?: string };

  if (!code || !idToken) {
    return NextResponse.json({ error: "code and idToken required" }, { status: 400 });
  }

  const uid = await verifyIdToken(idToken);
  if (!uid) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Fetch the stored OTP
  const record = await dbGet(`users/${uid}/otpCode`, idToken) as OtpRecord | null;
  if (!record) {
    return NextResponse.json({ error: "No pending verification. Please request a new code." }, { status: 400 });
  }

  if (Date.now() > record.expiresAt) {
    await dbDelete(`users/${uid}/otpCode`, idToken);
    return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
  }

  if (record.code !== code.trim()) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
  }

  // OTP valid — persist phone to user profile and write phoneIndex
  const phoneDisplay = record.phone.length === 11
    ? `+${record.phone}`
    : `+1${record.phone}`;

  const [profileOk, indexOk] = await Promise.all([
    dbPatch(`users/${uid}/profile`, { phone: phoneDisplay }, idToken),
    dbPutPublic(`phoneIndex/${record.phone}`, uid, idToken),
  ]);

  // Clean up OTP regardless of above success
  await dbDelete(`users/${uid}/otpCode`, idToken);

  if (!profileOk || !indexOk) {
    return NextResponse.json({ error: "Verified but failed to save — try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, phone: phoneDisplay });
}
