import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_DISPLAY_NAME, isDemoAccount } from "@/lib/demo-account";
import { seedDemoAccount } from "@/lib/demo-seed";

export async function signInWithEmail(email: string, password: string) {
  const normalized = email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(auth, normalized, password);
    if (isDemoAccount(cred.user.email)) {
      await seedDemoAccount(cred.user.uid);
    }
    return cred;
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;

    if (
      isDemoAccount(normalized) &&
      password === DEMO_PASSWORD &&
      (code === "auth/user-not-found" || code === "auth/invalid-credential")
    ) {
      const cred = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
      await updateProfile(cred.user, { displayName: DEMO_DISPLAY_NAME });
      await seedDemoAccount(cred.user.uid);
      return cred;
    }

    throw err;
  }
}
