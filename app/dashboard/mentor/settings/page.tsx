"use client";
import { useEffect, useState } from "react";
import { HeartHandshake, User, Mail, Phone, MapPin, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { loadUserProfile, saveUserProfile } from "@/lib/user-profile-store";
import { emptyProfile } from "@/lib/demo-data";

export default function MentorSettingsPage() {
  const { user, displayName, isMentorDemo } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadUserProfile(user.uid)
      .then((p) => {
        const base = p ?? emptyProfile(user.email ?? "", displayName, "mentor");
        setName(base.name);
        setEmail(base.email || user.email || "");
        setPhone(base.phone);
        setCity(base.city);
        setBio((p as { bio?: string })?.bio ?? "");
      })
      .finally(() => setLoading(false));
  }, [user, displayName]);

  async function save() {
    if (!user || isMentorDemo) return;
    await saveUserProfile(user.uid, {
      name,
      email,
      phone,
      city,
      age: "",
      focus: [],
      role: "mentor",
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your mentor profile</p>
      </div>

      {isMentorDemo && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 text-sm text-teal-800">
          Demo account — profile is read-only for judges. Sign up as a real mentor to edit your profile.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={name || displayName} size="lg" />
          <div>
            <h2 className="font-bold text-gray-900">{name || displayName}</h2>
            <Badge className="bg-teal-50 text-teal-700 mt-1">
              <HeartHandshake className="h-3 w-3 mr-1" /> Peer Mentor
            </Badge>
          </div>
        </div>

        {[
          { icon: User, label: "Full name", value: name, set: setName },
          { icon: Mail, label: "Email", value: email, set: setEmail },
          { icon: Phone, label: "Phone", value: phone, set: setPhone },
          { icon: MapPin, label: "City", value: city, set: setCity },
        ].map(({ icon: Icon, label, value, set }) => (
          <div key={label}>
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
              <Icon className="h-3.5 w-3.5 text-gray-400" /> {label}
            </label>
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              disabled={isMentorDemo}
              className={cn(
                "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm",
                isMentorDemo && "bg-gray-50 text-gray-600"
              )}
            />
          </div>
        ))}

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isMentorDemo}
            rows={4}
            className={cn(
              "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm",
              isMentorDemo && "bg-gray-50 text-gray-600"
            )}
          />
        </div>

        {!isMentorDemo && (
          <Button variant="gold" onClick={save} className="w-full sm:w-auto">
            {saved ? <><Check className="h-4 w-4 mr-1.5" /> Saved</> : <><Save className="h-4 w-4 mr-1.5" /> Save changes</>}
          </Button>
        )}
      </div>
    </div>
  );
}
