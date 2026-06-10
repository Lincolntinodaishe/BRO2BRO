"use client";
import { useState } from "react";
import { Search, MapPin, Phone, Clock, Star, ExternalLink, Filter, ChevronRight, Scissors, Heart, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Category = "all" | "clinic" | "barbershop" | "mental" | "support";

interface Resource {
  id: string;
  name: string;
  type: Category;
  address: string;
  city: string;
  phone: string;
  hours: string;
  distance: string;
  free: boolean;
  rating: number;
  tags: string[];
}

const RESOURCES: Resource[] = [
  {
    id: "1",
    name: "UAMS Community Clinic",
    type: "clinic",
    address: "4301 W Markham St",
    city: "Little Rock, AR 72205",
    phone: "(501) 686-7000",
    hours: "Mon–Fri 8AM–5PM",
    distance: "0.8 mi",
    free: true,
    rating: 4.8,
    tags: ["Blood Pressure", "Diabetes", "Uninsured OK"],
  },
  {
    id: "2",
    name: "Joe's Classic Cuts — UAMS Partner",
    type: "barbershop",
    address: "1523 Main St",
    city: "Little Rock, AR 72202",
    phone: "(501) 555-0142",
    hours: "Tue–Sat 9AM–7PM",
    distance: "1.2 mi",
    free: true,
    rating: 4.9,
    tags: ["BP Screening", "CHW Certified", "Barbershop Talk"],
  },
  {
    id: "3",
    name: "Arkansas Mental Health Center",
    type: "mental",
    address: "305 S Palm St",
    city: "Little Rock, AR 72205",
    phone: "(501) 686-9300",
    hours: "Mon–Fri 9AM–6PM",
    distance: "1.7 mi",
    free: false,
    rating: 4.5,
    tags: ["Counseling", "Sliding Scale", "Black Therapists"],
  },
  {
    id: "4",
    name: "Central AR Men's Health Coalition",
    type: "support",
    address: "922 W 12th St",
    city: "Little Rock, AR 72202",
    phone: "(501) 555-0188",
    hours: "Wednesdays 6–8PM",
    distance: "2.1 mi",
    free: true,
    rating: 4.7,
    tags: ["Peer Support", "Weekly Meetings", "Men Only"],
  },
  {
    id: "5",
    name: "Baptist Health Clinic — South",
    type: "clinic",
    address: "11 Stagecoach Dr",
    city: "Little Rock, AR 72210",
    phone: "(501) 202-3000",
    hours: "Mon–Sat 7AM–7PM",
    distance: "3.4 mi",
    free: false,
    rating: 4.6,
    tags: ["Full Primary Care", "Same-Day", "Accepts Medicaid"],
  },
  {
    id: "6",
    name: "King's Fades & Wellness",
    type: "barbershop",
    address: "4407 Asher Ave",
    city: "Little Rock, AR 72204",
    phone: "(501) 555-0210",
    hours: "Mon–Sat 9AM–8PM",
    distance: "3.8 mi",
    free: true,
    rating: 4.6,
    tags: ["BP Screening", "CHW Certified", "Nutrition Talks"],
  },
  {
    id: "7",
    name: "Pine Bluff Community Health Center",
    type: "clinic",
    address: "2901 S Olive St",
    city: "Pine Bluff, AR 71601",
    phone: "(870) 543-1222",
    hours: "Mon–Fri 8AM–5PM",
    distance: "42.3 mi",
    free: true,
    rating: 4.4,
    tags: ["FQHC", "Uninsured OK", "Telehealth Available"],
  },
  {
    id: "8",
    name: "New Life Recovery Support",
    type: "support",
    address: "700 Wright Ave",
    city: "Little Rock, AR 72206",
    phone: "(501) 555-0177",
    hours: "Mon/Wed/Fri 6–8PM",
    distance: "2.9 mi",
    free: true,
    rating: 4.8,
    tags: ["Substance Use", "Peer Support", "Faith-Based"],
  },
];

const CATEGORIES = [
  { id: "all",       label: "All Resources",   icon: MapPin,      count: RESOURCES.length },
  { id: "clinic",    label: "Clinics",          icon: Building2,   count: RESOURCES.filter((r) => r.type === "clinic").length },
  { id: "barbershop",label: "Barbershops",      icon: Scissors,    count: RESOURCES.filter((r) => r.type === "barbershop").length },
  { id: "mental",    label: "Mental Health",    icon: Heart,       count: RESOURCES.filter((r) => r.type === "mental").length },
  { id: "support",   label: "Support Groups",   icon: Users,       count: RESOURCES.filter((r) => r.type === "support").length },
];

const TYPE_COLORS: Record<string, string> = {
  clinic:     "bg-blue-100 text-blue-700",
  barbershop: "bg-amber-100 text-amber-700",
  mental:     "bg-purple-100 text-purple-700",
  support:    "bg-teal-100 text-teal-700",
};

export default function ResourcesPage() {
  const [zip, setZip] = useState("72201");
  const [searchedZip, setSearchedZip] = useState("72201");
  const [category, setCategory] = useState<Category>("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [searched, setSearched] = useState(true);

  const filtered = RESOURCES.filter((r) => {
    if (category !== "all" && r.type !== category) return false;
    if (freeOnly && !r.free) return false;
    return true;
  });

  function handleSearch() {
    setSearchedZip(zip);
    setSearched(true);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Find Resources Near You</h1>
        <p className="text-gray-500 text-sm mt-1">
          Free clinics, partner barbershops, mental health, and support groups — filtered by your zip code.
        </p>
      </div>

      {/* Zip code search */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-black transition-colors">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter your zip code (e.g. 72201)"
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                maxLength={5}
              />
            </div>
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4 mr-2" /> Search Zip Code
            </Button>
            <Button
              variant={freeOnly ? "default" : "outline"}
              onClick={() => setFreeOnly((p) => !p)}
              className="shrink-0 gap-2"
            >
              <Filter className="h-4 w-4" />
              Free Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <>
          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id as Category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  category === c.id
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
                <span className={cn("text-xs", category === c.id ? "text-gray-300" : "text-gray-400")}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Resource list */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filtered.length} resources</span> near {searchedZip}
              </p>
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No resources match those filters. Try removing &quot;Free Only.&quot;</p>
                </div>
              )}
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id === selected ? null : r.id)}
                  className={cn(
                    "w-full text-left bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-card",
                    selected === r.id ? "border-black shadow-card" : "border-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                        {r.free && <Badge variant="success" size="sm">Free</Badge>}
                        <Badge className={cn("text-xs", TYPE_COLORS[r.type])} size="sm">
                          {CATEGORIES.find((c) => c.id === r.type)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {r.address}, {r.city}
                        <span className="text-gray-300">·</span>
                        <span className="font-medium text-teal-600">{r.distance}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <Badge key={t} variant="secondary" size="sm">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1 text-xs text-gray-700">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        {r.rating}
                      </div>
                      <ChevronRight className={cn("h-4 w-4 text-gray-400 transition-transform", selected === r.id && "rotate-90")} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selected === r.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 animate-fade-in">
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">Phone</div>
                        <a href={`tel:${r.phone}`} className="text-sm font-medium text-black flex items-center gap-1.5 hover:underline">
                          <Phone className="h-3.5 w-3.5" />{r.phone}
                        </a>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">Hours</div>
                        <div className="text-sm text-gray-700 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />{r.hours}
                        </div>
                      </div>
                      <div className="col-span-2 flex gap-2 mt-1">
                        <Button size="sm" className="flex-1">Book Appointment</Button>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" /> Directions
                        </Button>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* CSS Map */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Map — {searchedZip}</p>
                  </div>
                  {/* CSS Map mock */}
                  <div className="relative h-80 bg-gray-50 overflow-hidden">
                    {/* Grid lines */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Roads */}
                      <line x1="0" y1="160" x2="100%" y2="160" stroke="#d1d5db" strokeWidth="3" />
                      <line x1="0" y1="240" x2="100%" y2="240" stroke="#d1d5db" strokeWidth="2" />
                      <line x1="160" y1="0" x2="160" y2="100%" stroke="#d1d5db" strokeWidth="3" />
                      <line x1="260" y1="0" x2="260" y2="100%" stroke="#d1d5db" strokeWidth="2" />
                      {/* River */}
                      <path d="M 0,80 C 80,60 120,100 200,85 S 300,60 400,90" fill="none" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
                    </svg>

                    {/* Map pins */}
                    {filtered.slice(0, 6).map((r, i) => {
                      const positions = [
                        { x: "30%", y: "42%" }, { x: "52%", y: "58%" },
                        { x: "68%", y: "35%" }, { x: "22%", y: "65%" },
                        { x: "75%", y: "62%" }, { x: "45%", y: "30%" },
                      ];
                      const pos = positions[i] ?? { x: "50%", y: "50%" };
                      return (
                        <button
                          key={r.id}
                          onClick={() => setSelected(r.id === selected ? null : r.id)}
                          style={{ left: pos.x, top: pos.y }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        >
                          <div className={cn(
                            "w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110",
                            selected === r.id ? "bg-black scale-110" : TYPE_COLORS[r.type].split(" ")[0]
                          )}>
                            <MapPin className={cn("h-3.5 w-3.5", selected === r.id ? "text-white" : TYPE_COLORS[r.type].split(" ")[1])} />
                          </div>
                          {selected === r.id && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                              {r.name}
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {/* User location */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md">
                        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50" />
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-3 left-3 bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 flex flex-col gap-1.5">
                      {[
                        { label: "Clinic",       color: "bg-blue-100" },
                        { label: "Barbershop",   color: "bg-amber-100" },
                        { label: "Mental Health",color: "bg-purple-100" },
                        { label: "Support",      color: "bg-teal-100" },
                      ].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5">
                          <div className={cn("w-2.5 h-2.5 rounded-full", l.color)} />
                          <span className="text-xs text-gray-600">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
