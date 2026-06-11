import { ref, get, set } from "firebase/database";
import { requireDb } from "@/lib/firebase";
import type { UserProfileData } from "@/lib/demo-data";
import { phoneKey } from "@/lib/phone-utils";

function profileRef(uid: string) {
  return ref(requireDb(), `users/${uid}/profile`);
}

export async function loadUserProfile(uid: string): Promise<UserProfileData | null> {
  const snap = await get(profileRef(uid));
  if (!snap.exists()) return null;
  return snap.val() as UserProfileData;
}

export async function saveUserProfile(uid: string, profile: UserProfileData): Promise<void> {
  await set(profileRef(uid), profile);

  // Write phone→uid index so inbound Twilio SMS can resolve the account
  if (profile.phone) {
    const key = phoneKey(profile.phone);
    if (key.length >= 10) {
      await set(ref(requireDb(), `phoneIndex/${key}`), uid);
    }
  }
}
