import { NextRequest, NextResponse } from "next/server";
import { uidFromPhone } from "@/lib/twilio-client";

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "";

async function getProfile(uid: string) {
  try {
    const res = await fetch(`${DB_URL}/users/${uid}/profile.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function countAppointments(uid: string): Promise<number> {
  try {
    const res = await fetch(`${DB_URL}/users/${uid}/appointments.json`);
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data) return 0;
    return Object.values(data).filter(
      (a: unknown) => {
        const appt = a as { status?: string };
        return appt.status === "confirmed" || appt.status === "pending";
      }
    ).length;
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone") ?? "";
  if (!phone) {
    return NextResponse.json({ connected: false });
  }

  const uid = await uidFromPhone(phone);
  if (!uid) {
    return NextResponse.json({ connected: false });
  }

  const profile = await getProfile(uid);
  const appointmentCount = await countAppointments(uid);

  return NextResponse.json({
    connected: true,
    uid,
    name: profile?.name ?? null,
    role: profile?.role ?? "member",
    appointmentCount,
  });
}
