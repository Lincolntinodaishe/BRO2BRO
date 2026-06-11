"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  isMemberDemoAccount,
  isBarberDemoAccount,
  DEMO_DISPLAY_NAME,
  BARBER_DEMO_DISPLAY_NAME,
  BARBER_DEMO_SHOP_NAME,
  type UserRole,
} from "@/lib/demo-account";
import { seedDemoAccount } from "@/lib/demo-seed";
import { seedBarberDemoAccount } from "@/lib/demo-barber-seed";
import { loadUserProfile } from "@/lib/user-profile-store";

const SESSION_COOKIE = "has_session";

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

interface AuthContextValue {
  user:              User | null;
  loading:           boolean;
  displayName:       string;
  shopName:          string;
  userRole:          UserRole;
  isTestAccount:     boolean;
  isBarberDemo:      boolean;
  signOut:           () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:              null,
  loading:           true,
  displayName:       "",
  shopName:          "",
  userRole:          "member",
  isTestAccount:     false,
  isBarberDemo:      false,
  signOut:           async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]             = useState<User | null>(null);
  const [loading, setLoading]       = useState(true);
  const [userRole, setUserRole]     = useState<UserRole>("member");
  const [shopName, setShopName]     = useState("");

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      setLoading(false);

      if (fbUser) {
        setCookie(SESSION_COOKIE, "1", 60 * 60 * 24 * 7);

        if (isBarberDemoAccount(fbUser.email)) {
          seedBarberDemoAccount(fbUser.uid).catch(console.error);
          setUserRole("barber");
          setShopName(BARBER_DEMO_SHOP_NAME);
        } else if (isMemberDemoAccount(fbUser.email)) {
          seedDemoAccount(fbUser.uid).catch(console.error);
          setUserRole("member");
          setShopName("");
        } else {
          try {
            const profile = await loadUserProfile(fbUser.uid);
            setUserRole(profile?.role ?? "member");
            setShopName(profile?.shopName ?? "");
          } catch {
            setUserRole("member");
            setShopName("");
          }
        }
      } else {
        setCookie(SESSION_COOKIE, "", 0);
        setUserRole("member");
        setShopName("");
      }
    });
    return unsub;
  }, []);

  async function signOut() {
    if (auth) await firebaseSignOut(auth);
    setCookie(SESSION_COOKIE, "", 0);
  }

  const memberDemo = isMemberDemoAccount(user?.email);
  const barberDemo = isBarberDemoAccount(user?.email);

  const displayName = memberDemo
    ? DEMO_DISPLAY_NAME
    : barberDemo
      ? BARBER_DEMO_DISPLAY_NAME
      : (user?.displayName ?? user?.email?.split("@")[0] ?? "User");

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      displayName,
      shopName,
      userRole,
      isTestAccount: memberDemo,
      isBarberDemo: barberDemo,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
