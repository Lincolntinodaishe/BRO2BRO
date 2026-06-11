"use client";
import { useEffect, useState } from "react";
import { Scissors, User, Mail, Phone, MapPin, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { loadUserProfile, saveUserProfile } from "@/lib/user-profile-store";
import { emptyProfile } from "@/lib/demo-data";

export default function BarberSettingsPage() {
  const { user, displayName, shopName: authShopName, isBarberDemo } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadUserProfile(user.uid)
      .then((p) => {
        const base = p ?? emptyProfile(user.email ?? "", displayName, "barber");
        setName(base.name);
        setEmail(base.email || user.email || "");
        setPhone(base.phone);
        setCity(base.city);
        setShopName(base.shopName ?? authShopName ?? "");
      })
      .finally(() => setLoading(false));
  }, [user, displayName, authShopName]);

  async function save() {
    if (!user) return;
    await saveUserProfile(user.uid, {
      name,
      email,
      phone,
      city,
      age: "",
      focus: [],
      role: "barber",
      shopName,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900">Settings</h1>
            {isBarberDemo && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200" size="sm">Demo profile</Badge>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">Manage your shop profile and contact info.</p>
        </div>
        <Button onClick={save} className="gap-2 self-start sm:self-auto">
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4">
          <Avatar name={name} size="lg" online />
          <div>
            <p className="text-sm font-bold text-gray-900">{name}</p>
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
              <Scissors className="h-3 w-3" /> Licensed Barber · CHW Partner
            </p>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", value: name, set: setName, icon: User, type: "text" },
            { label: "Shop Name", value: shopName, set: setShopName, icon: Scissors, type: "text" },
            { label: "Email", value: email, set: setEmail, icon: Mail, type: "email" },
            { label: "Phone", value: phone, set: setPhone, icon: Phone, type: "tel" },
            { label: "City / ZIP", value: city, set: setCity, icon: MapPin, type: "text" },
          ].map((f) => (
            <div key={f.label} className={f.label === "City / ZIP" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <div className="relative">
                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none",
                    "focus:border-black focus:ring-2 focus:ring-black/5"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
