import {
  getDemoRedirectPath,
  isBarberDemoAccount,
  type UserRole,
} from "@/lib/demo-account";
import { loadUserProfile } from "@/lib/user-profile-store";

export function getRedirectPathForRole(role: UserRole | undefined): string {
  if (role === "barber") return "/dashboard/barber";
  return "/dashboard";
}

export async function getPostAuthPath(
  uid: string,
  email: string | null | undefined
): Promise<string> {
  const demoPath = getDemoRedirectPath(email);
  if (demoPath) return demoPath;

  const profile = await loadUserProfile(uid);
  return getRedirectPathForRole(profile?.role);
}

export function canAccessBarberPortal(
  email: string | null | undefined,
  role: UserRole | undefined
): boolean {
  return isBarberDemoAccount(email) || role === "barber";
}

export function canAccessMemberPortal(
  email: string | null | undefined,
  role: UserRole | undefined
): boolean {
  if (isBarberDemoAccount(email)) return false;
  return !role || role === "member" || role === "family";
}
