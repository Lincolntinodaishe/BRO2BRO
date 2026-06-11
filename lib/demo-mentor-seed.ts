import { saveUserProfile } from "@/lib/user-profile-store";
import { MENTOR_DEMO_PROFILE } from "@/lib/demo-mentor-data";
import { seedMentorDemoData } from "@/lib/mentor-store";

/** Seed (or refresh) the mentor hackathon demo account with rich mock data. */
export async function seedMentorDemoAccount(uid: string): Promise<void> {
  await Promise.all([
    saveUserProfile(uid, MENTOR_DEMO_PROFILE),
    seedMentorDemoData(uid),
  ]);
}
