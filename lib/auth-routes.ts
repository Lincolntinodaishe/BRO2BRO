import {
  getDemoRedirectPath,
  isBarberDemoAccount,
  isMentorDemoAccount,
  type UserRole,
} from "@/lib/demo-account";
import { loadUserProfile } from "@/lib/user-profile-store";

export function getRedirectPathForRole(role: UserRole | undefined): string {
  if (role === "barber") return "/dashboard/barber";
  if (role === "mentor") return "/dashboard/mentor";
  return "/dashboard";
}

export async function getPostAuthPath(
  uid: string,
  email: string | null | undefined
): Promise<string> {
  const demoPath = getDemoRedirectPath(email);
  if (demoPath) return demoPath;

  try {
    const profile = await loadUserProfile(uid);
    return getRedirectPathForRole(profile?.role);
  } catch {
    // DB not configured or rules block the read — default to member dashboard
    return "/dashboard";
  }
}

export function canAccessBarberPortal(
  email: string | null | undefined,
  role: UserRole | undefined
): boolean {
  return isBarberDemoAccount(email) || role === "barber";
}

export function canAccessMentorPortal(
  email: string | null | undefined,
  role: UserRole | undefined
): boolean {
  return isMentorDemoAccount(email) || role === "mentor";
}

export function canAccessMemberPortal(
  email: string | null | undefined,
  role: UserRole | undefined
): boolean {
  if (isBarberDemoAccount(email) || isMentorDemoAccount(email)) return false;
  return !role || role === "member" || role === "family";
}
