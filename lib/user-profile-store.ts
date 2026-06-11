import { ref, get, set } from "firebase/database";
import { db } from "@/lib/firebase";
import type { UserProfileData } from "@/lib/demo-data";

function profileRef(uid: string) {
  return ref(db, `users/${uid}/profile`);
}

export async function loadUserProfile(uid: string): Promise<UserProfileData | null> {
  const snap = await get(profileRef(uid));
  if (!snap.exists()) return null;
  return snap.val() as UserProfileData;
}

export async function saveUserProfile(uid: string, profile: UserProfileData): Promise<void> {
  await set(profileRef(uid), profile);
}
