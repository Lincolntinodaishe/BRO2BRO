/** Normalise any phone string → all-digits key used in RTDB phoneIndex */
export function phoneKey(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // Ensure 11-digit US number (prepend 1 if 10 digits)
  if (digits.length === 10) return `1${digits}`;
  return digits;
}
