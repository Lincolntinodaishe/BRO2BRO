export const DEMO_EMAIL = "test@gmail.com";
export const DEMO_PASSWORD = "test123@";
export const DEMO_DISPLAY_NAME = "Marcus J.";

export const BARBER_DEMO_EMAIL = "barber@gmail.com";
export const BARBER_DEMO_PASSWORD = "barber123@";
export const BARBER_DEMO_DISPLAY_NAME = "Joe T.";
export const BARBER_DEMO_SHOP_NAME = "Joe's Classic Cuts";

export type UserRole = "member" | "barber" | "mentor" | "provider" | "family";

export function isMemberDemoAccount(email: string | null | undefined): boolean {
  return email?.toLowerCase() === DEMO_EMAIL;
}

export function isBarberDemoAccount(email: string | null | undefined): boolean {
  return email?.toLowerCase() === BARBER_DEMO_EMAIL;
}

/** @deprecated use isMemberDemoAccount */
export function isDemoAccount(email: string | null | undefined): boolean {
  return isMemberDemoAccount(email);
}

export function isAnyDemoAccount(email: string | null | undefined): boolean {
  return isMemberDemoAccount(email) || isBarberDemoAccount(email);
}

export function getDemoRedirectPath(email: string | null | undefined): string | null {
  if (isBarberDemoAccount(email)) return "/dashboard/barber";
  if (isMemberDemoAccount(email)) return "/dashboard";
  return null;
}
