"use client";
import { useState } from "react";
import {
  User, Bell, Shield, Palette, Camera, Save, Trash2,
  Download, AlertTriangle, Check, Mail, Phone, MapPin,
  Scissors, MessageCircle, Calendar, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ── Toggle ──────────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        checked ? "bg-black" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow-sm transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ── Section wrapper ────────────────────────────────────────── */
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

/* ── Input field ─────────────────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  icon?: typeof User;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border border-gray-200 py-2.5 text-sm outline-none transition-colors",
            Icon ? "pl-9 pr-4" : "px-4",
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-900 focus:border-black focus:ring-2 focus:ring-black/5"
          )}
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ── Notification row ────────────────────────────────────────── */
function NotifRow({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
  iconColor = "text-gray-500",
  iconBg = "bg-gray-100",
}: {
  icon: typeof Bell;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ── Tab pill ────────────────────────────────────────────────── */
const TABS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy",       label: "Privacy & Data", icon: Shield },
  { id: "appearance",    label: "Appearance",    icon: Palette },
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ── Page ────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [tab, setTab]         = useState<Tab>("profile");
  const [saved, setSaved]     = useState(false);

  /* Profile fields */
  const [name,  setName]   = useState("Marcus J.");
  const [email, setEmail]  = useState("marcus@example.com");
  const [phone, setPhone]  = useState("(501) 555-0142");
  const [city,  setCity]   = useState("Little Rock, AR");
  const [age,   setAge]    = useState("35–44");
  const [focus, setFocus]  = useState<string[]>(["Blood Pressure", "Mental Wellness"]);

  /* Notification toggles */
  const [notifs, setNotifs] = useState({
    apptReminder:  true,
    weeklyCheckin: true,
    crewActivity:  false,
    community:     false,
    sms:           true,
    emailNotif:    true,
    crisis:        true,
  });

  /* Privacy */
  const [privacy, setPrivacy] = useState({
    shareAnonymous: true,
    locationData:   false,
    researchOpt:    true,
  });

  /* Appearance */
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

  const healthFocusOptions = [
    "Blood Pressure", "Mental Wellness", "Diabetes", "Weight Management",
    "Smoking Cessation", "Sleep Health", "Fitness", "Nutrition",
  ];

  function toggleFocus(item: string) {
    setFocus((p) => p.includes(item) ? p.filter((f) => f !== item) : [...p, item]);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile, preferences, and privacy.</p>
        </div>
        <Button onClick={save} className="gap-2 self-start sm:self-auto">
          {saved ? (
            <><Check className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-full overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-1 justify-center",
              tab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Profile tab ─────────────────────────────────────── */}
      {tab === "profile" && (
        <div className="space-y-5">
          {/* Avatar */}
          <Section title="Profile Photo">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <Avatar name={name} size="lg" online />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Upload a photo</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 5MB. Optional — your initials show by default.</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="xs">Upload Photo</Button>
                  <Button variant="ghost" size="xs" className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                </div>
              </div>
            </div>
          </Section>

          {/* Personal info */}
          <Section title="Personal Information" desc="Used to personalize your experience — never shared without consent.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name"   value={name}  onChange={setName}  icon={User} />
              <Field label="Email"       value={email} onChange={setEmail} icon={Mail} type="email" hint="Used for appointment confirmations." />
              <Field label="Phone"       value={phone} onChange={setPhone} icon={Phone} type="tel" hint="Used for SMS check-in reminders." />
              <Field label="City / ZIP"  value={city}  onChange={setCity}  icon={MapPin} hint="Used to find resources near you." />
            </div>
          </Section>

          {/* Health profile */}
          <Section title="Health Profile" desc="Helps Bro.AI tailor conversations and resource suggestions.">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Age Range</label>
              <div className="flex flex-wrap gap-2">
                {["18–24", "25–34", "35–44", "45–54", "55–64", "65+"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      age === a
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Health Focus Areas</label>
              <p className="text-xs text-gray-400 mb-3">Select all that apply — this is private.</p>
              <div className="flex flex-wrap gap-2">
                {healthFocusOptions.map((item) => {
                  const on = focus.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleFocus(item)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                        on
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {on && <Check className="h-3 w-3" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── Notifications tab ───────────────────────────────── */}
      {tab === "notifications" && (
        <div className="space-y-5">
          <Section title="Health Reminders">
            <NotifRow
              icon={Calendar}
              label="Appointment Reminders"
              desc="Get reminded 24 hours and 1 hour before appointments."
              checked={notifs.apptReminder}
              onChange={(v) => setNotifs((p) => ({ ...p, apptReminder: v }))}
              iconBg="bg-blue-50" iconColor="text-blue-600"
            />
            <NotifRow
              icon={Activity}
              label="Weekly Check-in"
              desc="Monday morning nudge to log how you're doing."
              checked={notifs.weeklyCheckin}
              onChange={(v) => setNotifs((p) => ({ ...p, weeklyCheckin: v }))}
              iconBg="bg-amber-50" iconColor="text-amber-600"
            />
          </Section>

          <Section title="Community Activity">
            <NotifRow
              icon={User}
              label="Crew Activity"
              desc="When crew members hit milestones or check in."
              checked={notifs.crewActivity}
              onChange={(v) => setNotifs((p) => ({ ...p, crewActivity: v }))}
              iconBg="bg-teal-50" iconColor="text-teal-600"
            />
            <NotifRow
              icon={MessageCircle}
              label="Community Updates"
              desc="New posts, replies, and announcements in the forum."
              checked={notifs.community}
              onChange={(v) => setNotifs((p) => ({ ...p, community: v }))}
              iconBg="bg-purple-50" iconColor="text-purple-600"
            />
          </Section>

          <Section title="Delivery Channels">
            <NotifRow
              icon={Phone}
              label="SMS Notifications"
              desc="Text message alerts to your phone number."
              checked={notifs.sms}
              onChange={(v) => setNotifs((p) => ({ ...p, sms: v }))}
              iconBg="bg-green-50" iconColor="text-green-600"
            />
            <NotifRow
              icon={Mail}
              label="Email Notifications"
              desc="Summaries and confirmations to your email."
              checked={notifs.emailNotif}
              onChange={(v) => setNotifs((p) => ({ ...p, emailNotif: v }))}
              iconBg="bg-blue-50" iconColor="text-blue-600"
            />
          </Section>

          <Section title="Safety">
            <NotifRow
              icon={Bell}
              label="Crisis Escalation Alerts"
              desc="Always-on: surfaces 988 and emergency resources when needed."
              checked={notifs.crisis}
              onChange={(v) => setNotifs((p) => ({ ...p, crisis: v }))}
              iconBg="bg-red-50" iconColor="text-red-600"
            />
            <p className="text-xs text-gray-400 -mt-2">Crisis escalation cannot be fully disabled for your safety.</p>
          </Section>
        </div>
      )}

      {/* ── Privacy tab ─────────────────────────────────────── */}
      {tab === "privacy" && (
        <div className="space-y-5">
          <Section title="Data Sharing" desc="Control what data is used to improve BRO2BRO.">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Anonymous usage data</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Aggregated, non-identifiable data helps us improve the product. No names, no health values.
                </div>
              </div>
              <Toggle checked={privacy.shareAnonymous} onChange={(v) => setPrivacy((p) => ({ ...p, shareAnonymous: v }))} />
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Location data</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Precise location is never stored. When off, we use your ZIP code only.
                </div>
              </div>
              <Toggle checked={privacy.locationData} onChange={(v) => setPrivacy((p) => ({ ...p, locationData: v }))} />
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Research participation</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Opt in to contribute to UAMS health research (fully anonymous, separate consent form required).
                </div>
              </div>
              <Toggle checked={privacy.researchOpt} onChange={(v) => setPrivacy((p) => ({ ...p, researchOpt: v }))} />
            </div>
          </Section>

          <Section title="Your Data">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Download className="h-4 w-4" />
                Download My Data
              </Button>
              <Button variant="outline" className="gap-2 flex-1 border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Delete Health Data
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Deletion is processed within 24 hours. You&apos;ll receive an SMS confirmation. This action is irreversible.
            </p>
          </Section>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-700 mb-1">Delete Account</h3>
                <p className="text-xs text-red-600 leading-relaxed mb-4">
                  Permanently deletes your profile, all health data, conversation history, and crew connections.
                  This cannot be undone.
                </p>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100 gap-2">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete My Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Appearance tab ──────────────────────────────────── */}
      {tab === "appearance" && (
        <div className="space-y-5">
          <Section title="Text Size" desc="Applies across the entire dashboard.">
            <div className="flex gap-3">
              {(["sm", "md", "lg"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={cn(
                    "flex-1 py-3 rounded-xl border-2 text-center transition-all",
                    fontSize === s ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <span className={cn("font-semibold block", s === "sm" ? "text-xs" : s === "md" ? "text-sm" : "text-base")}>
                    Aa
                  </span>
                  <span className="text-xs mt-0.5 block opacity-70">{s === "sm" ? "Small" : s === "md" ? "Default" : "Large"}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Dashboard Theme">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Light (Default)", bg: "bg-white", border: "border-gray-200", preview: "bg-gray-50" },
                { label: "Coming Soon",     bg: "bg-gray-900", border: "border-gray-700", preview: "bg-gray-800", disabled: true },
              ].map((t) => (
                <button
                  key={t.label}
                  disabled={t.disabled}
                  className={cn(
                    "rounded-xl border-2 overflow-hidden text-left transition-all",
                    !t.disabled ? "border-black" : "border-gray-200 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn("h-14 w-full", t.preview)} />
                  <div className={cn("px-3 py-2", t.bg)}>
                    <span className={cn("text-xs font-medium", t.disabled ? "text-gray-400" : "text-gray-900")}>
                      {t.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Language">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Display Language</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors bg-white">
                <option>English (US)</option>
                <option>Español</option>
              </select>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
