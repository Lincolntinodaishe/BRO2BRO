const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "";
const FB_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

/** Verify a Firebase ID token server-side and return the uid (no Admin SDK needed) */
export async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FB_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.users?.[0]?.localId as string) ?? null;
  } catch {
    return null;
  }
}

/** Read a RTDB path authenticated as the user (uses their ID token) */
export async function dbGet(path: string, idToken: string): Promise<unknown> {
  const res = await fetch(`${DB_URL}/${path}.json?auth=${idToken}`);
  if (!res.ok) return null;
  return res.json();
}

/** Write (PUT) a RTDB path authenticated as the user */
export async function dbPut(path: string, value: unknown, idToken: string): Promise<boolean> {
  const res = await fetch(`${DB_URL}/${path}.json?auth=${idToken}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  return res.ok;
}

/** Partial update (PATCH) a RTDB path authenticated as the user */
export async function dbPatch(path: string, value: unknown, idToken: string): Promise<boolean> {
  const res = await fetch(`${DB_URL}/${path}.json?auth=${idToken}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  return res.ok;
}

/** Delete a RTDB path authenticated as the user */
export async function dbDelete(path: string, idToken: string): Promise<boolean> {
  const res = await fetch(`${DB_URL}/${path}.json?auth=${idToken}`, {
    method: "DELETE",
  });
  return res.ok;
}

/** Write phoneIndex publicly: /phoneIndex/{digits} → uid (requires phoneIndex write rule: auth !== null) */
export async function dbPutPublic(path: string, value: unknown, idToken: string): Promise<boolean> {
  const res = await fetch(`${DB_URL}/${path}.json?auth=${idToken}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  return res.ok;
}
