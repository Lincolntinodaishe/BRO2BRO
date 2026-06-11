"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isDemoAccount, DEMO_DISPLAY_NAME } from "@/lib/demo-account";
import { seedDemoAccount } from "@/lib/demo-seed";

const SESSION_COOKIE = "has_session";

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

interface AuthContextValue {
  user:          User | null;
  loading:       boolean;
  displayName:   string;
  isTestAccount: boolean;
  signOut:       () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:          null,
  loading:       true,
  displayName:   "",
  isTestAccount: false,
  signOut:       async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      setLoading(false);

      if (fbUser) {
        setCookie(SESSION_COOKIE, "1", 60 * 60 * 24 * 7);
        if (isDemoAccount(fbUser.email)) {
          seedDemoAccount(fbUser.uid).catch(console.error);
        }
      } else {
        setCookie(SESSION_COOKIE, "", 0);
      }
    });
    return unsub;
  }, []);

  async function signOut() {
    if (auth) await firebaseSignOut(auth);
    setCookie(SESSION_COOKIE, "", 0);
  }

  const demo = isDemoAccount(user?.email);
  const displayName = demo
    ? DEMO_DISPLAY_NAME
    : (user?.displayName ?? user?.email?.split("@")[0] ?? "User");

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      displayName,
      isTestAccount: demo,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
