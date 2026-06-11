export const DEMO_EMAIL = "test@gmail.com";
export const DEMO_PASSWORD = "test123@";
export const DEMO_DISPLAY_NAME = "Marcus J.";

export function isDemoAccount(email: string | null | undefined): boolean {
  return email?.toLowerCase() === DEMO_EMAIL;
}
