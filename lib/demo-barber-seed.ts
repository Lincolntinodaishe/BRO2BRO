import { saveUserProfile } from "@/lib/user-profile-store";
import { BARBER_DEMO_PROFILE } from "@/lib/demo-data";
import { seedBarberDemoData } from "@/lib/barber-store";

/** Seed (or refresh) the barber hackathon demo account with rich mock data. */
export async function seedBarberDemoAccount(uid: string): Promise<void> {
  await Promise.all([
    saveUserProfile(uid, BARBER_DEMO_PROFILE),
    seedBarberDemoData(uid),
  ]);
}
