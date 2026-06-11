import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { requireAuth } from "@/lib/firebase";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_DISPLAY_NAME,
  BARBER_DEMO_EMAIL,
  BARBER_DEMO_PASSWORD,
  BARBER_DEMO_DISPLAY_NAME,
  isMemberDemoAccount,
  isBarberDemoAccount,
} from "@/lib/demo-account";
import { seedDemoAccount } from "@/lib/demo-seed";
import { seedBarberDemoAccount } from "@/lib/demo-barber-seed";

export async function signInWithEmail(email: string, password: string) {
  const normalized = email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(requireAuth(), normalized, password);
    if (isMemberDemoAccount(cred.user.email)) {
      await seedDemoAccount(cred.user.uid);
    } else if (isBarberDemoAccount(cred.user.email)) {
      await seedBarberDemoAccount(cred.user.uid);
    }
    return cred;
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;

    if (
      isMemberDemoAccount(normalized) &&
      password === DEMO_PASSWORD &&
      (code === "auth/user-not-found" || code === "auth/invalid-credential")
    ) {
      const cred = await createUserWithEmailAndPassword(requireAuth(), DEMO_EMAIL, DEMO_PASSWORD);
      await updateProfile(cred.user, { displayName: DEMO_DISPLAY_NAME });
      await seedDemoAccount(cred.user.uid);
      return cred;
    }

    if (
      isBarberDemoAccount(normalized) &&
      password === BARBER_DEMO_PASSWORD &&
      (code === "auth/user-not-found" || code === "auth/invalid-credential")
    ) {
      const cred = await createUserWithEmailAndPassword(requireAuth(), BARBER_DEMO_EMAIL, BARBER_DEMO_PASSWORD);
      await updateProfile(cred.user, { displayName: BARBER_DEMO_DISPLAY_NAME });
      await seedBarberDemoAccount(cred.user.uid);
      return cred;
    }

    throw err;
  }
}
