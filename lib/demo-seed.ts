import { saveUserAppointments, DEFAULT_APPOINTMENTS } from "@/lib/appointments-store";
import { saveUserProfile } from "@/lib/user-profile-store";
import { DEMO_PROFILE } from "@/lib/demo-data";

/** Seed (or refresh) the hackathon demo account with rich mock data. */
export async function seedDemoAccount(uid: string): Promise<void> {
  await Promise.all([
    saveUserAppointments(uid, DEFAULT_APPOINTMENTS),
    saveUserProfile(uid, DEMO_PROFILE),
  ]);
}
