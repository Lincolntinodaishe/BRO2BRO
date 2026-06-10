"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Search, MapPin, Phone, Clock, Star, ExternalLink,
  Filter, ChevronRight, Scissors, Heart, Building2,
  Users, Navigation, List, Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MapResource } from "@/components/dashboard/resource-map";

const ResourceMap = dynamic(() => import("@/components/dashboard/resource-map"), { ssr: false });

type Category = "all" | "clinic" | "barbershop" | "mental" | "support";
type Radius = "all" | 5 | 10 | 25;

interface Resource {
  id: string;
  name: string;
  type: Category;
  address: string;
  city: string;
  phone: string;
  hours: string;
  free: boolean;
  rating: number;
  tags: string[];
  lat: number;
  lng: number;
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
    free: true,
    rating: 4.8,
    tags: ["Blood Pressure", "Diabetes", "Uninsured OK"],
    lat: 34.7465,
    lng: -92.3353,
  },
  {
    id: "2",
    name: "Joe's Classic Cuts — UAMS Partner",
    type: "barbershop",
    address: "1523 Main St",
    city: "Little Rock, AR 72202",
    phone: "(501) 555-0142",
    hours: "Tue–Sat 9AM–7PM",
    free: true,
    rating: 4.9,
    tags: ["BP Screening", "CHW Certified", "Barbershop Talk"],
    lat: 34.7436,
    lng: -92.2888,
  },
  {
    id: "3",
    name: "Arkansas Mental Health Center",
    type: "mental",
    address: "305 S Palm St",
    city: "Little Rock, AR 72205",
    phone: "(501) 686-9300",
    hours: "Mon–Fri 9AM–6PM",
    free: false,
    rating: 4.5,
    tags: ["Counseling", "Sliding Scale", "Black Therapists"],
    lat: 34.7465,
    lng: -92.3200,
  },
  {
    id: "4",
    name: "Central AR Men's Health Coalition",
    type: "support",
    address: "922 W 12th St",
    city: "Little Rock, AR 72202",
    phone: "(501) 555-0188",
    hours: "Wednesdays 6–8PM",
    free: true,
    rating: 4.7,
    tags: ["Peer Support", "Weekly Meetings", "Men Only"],
    lat: 34.7304,
    lng: -92.2900,
  },
  {
    id: "5",
    name: "Baptist Health Clinic — South",
    type: "clinic",
    address: "11 Stagecoach Dr",
    city: "Little Rock, AR 72210",
    phone: "(501) 202-3000",
    hours: "Mon–Sat 7AM–7PM",
    free: false,
    rating: 4.6,
    tags: ["Full Primary Care", "Same-Day", "Accepts Medicaid"],
    lat: 34.7025,
    lng: -92.3800,
  },
  {
    id: "6",
    name: "King's Fades & Wellness",
    type: "barbershop",
    address: "4407 Asher Ave",
    city: "Little Rock, AR 72204",
    phone: "(501) 555-0210",
    hours: "Mon–Sat 9AM–8PM",
    free: true,
    rating: 4.6,
    tags: ["BP Screening", "CHW Certified", "Nutrition Talks"],
    lat: 34.7229,
    lng: -92.3300,
  },
  {
    id: "7",
    name: "Pine Bluff Community Health Center",
    type: "clinic",
    address: "2901 S Olive St",
    city: "Pine Bluff, AR 71601",
    phone: "(870) 543-1222",
    hours: "Mon–Fri 8AM–5PM",
    free: true,
    rating: 4.4,
    tags: ["FQHC", "Uninsured OK", "Telehealth Available"],
    lat: 34.2175,
    lng: -92.0180,
  },
  {
    id: "8",
    name: "New Life Recovery Support",
    type: "support",
    address: "700 Wright Ave",
    city: "Little Rock, AR 72206",
    phone: "(501) 555-0177",
    hours: "Mon/Wed/Fri 6–8PM",
    free: true,
    rating: 4.8,
    tags: ["Substance Use", "Peer Support", "Faith-Based"],
    lat: 34.7255,
    lng: -92.2670,
  },
];

const CATEGORIES = [
  { id: "all",        label: "All",           icon: MapPin,    count: RESOURCES.length },
  { id: "clinic",     label: "Clinics",        icon: Building2, count: RESOURCES.filter((r) => r.type === "clinic").length },
  { id: "barbershop", label: "Barbershops",    icon: Scissors,  count: RESOURCES.filter((r) => r.type === "barbershop").length },
  { id: "mental",     label: "Mental Health",  icon: Heart,     count: RESOURCES.filter((r) => r.type === "mental").length },
  { id: "support",    label: "Support Groups", icon: Users,     count: RESOURCES.filter((r) => r.type === "support").length },
];

const RADIUS_OPTIONS: { label: string; value: Radius }[] = [
  { label: "Any distance", value: "all" },
  { label: "5 mi",         value: 5 },
  { label: "10 mi",        value: 10 },
  { label: "25 mi",        value: 25 },
];

const TYPE_COLORS: Record<string, string> = {
  clinic:     "bg-blue-100 text-blue-700",
  barbershop: "bg-amber-100 text-amber-700",
  mental:     "bg-purple-100 text-purple-700",
  support:    "bg-teal-100 text-teal-700",
};

const DEFAULT_CENTER: [number, number] = [34.7465, -92.2896];

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(d: number): string {
  if (d < 0.1) return "< 0.1 mi";
  if (d < 10)  return `${d.toFixed(1)} mi`;
  return `${Math.round(d)} mi`;
}

export default function ResourcesPage() {
  const [zip, setZip]               = useState("72201");
  const [searchedZip, setSearchedZip] = useState("72201");
  const [category, setCategory]     = useState<Category>("all");
  const [freeOnly, setFreeOnly]     = useState(false);
  const [selected, setSelected]     = useState<string | null>(null);
  const [searched, setSearched]     = useState(true);
  const [mapCenter, setMapCenter]   = useState<[number, number]>(DEFAULT_CENTER);
  const [geocoding, setGeocoding]   = useState(false);
  const [geoError, setGeoError]     = useState("");
  const [searchKey, setSearchKey]   = useState(0);
  const [radius, setRadius]         = useState<Radius>("all");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  /* ── resources with live distances, filtered + sorted ── */
  const withDist = RESOURCES.map((r) => ({
    ...r,
    dist: haversine(mapCenter[0], mapCenter[1], r.lat, r.lng),
  }));

  const filtered = withDist
    .filter((r) => {
      if (category !== "all" && r.type !== category) return false;
      if (freeOnly && !r.free) return false;
      if (radius !== "all" && r.dist > (radius as number)) return false;
      return true;
    })
    .sort((a, b) => a.dist - b.dist);

  const mapResources: MapResource[] = filtered.map((r) => ({
    id: r.id, name: r.name, type: r.type,
    address: r.address, city: r.city,
    lat: r.lat, lng: r.lng,
    free: r.free, phone: r.phone, hours: r.hours,
  }));

  /* ── zip geocode search ── */
  const handleSearch = useCallback(async () => {
    const trimmed = zip.trim();
    if (trimmed.length !== 5 || !/^\d+$/.test(trimmed)) {
      setGeoError("Please enter a valid 5-digit zip code.");
      return;
    }
    setGeoError("");
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${trimmed}&country=US&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data?.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setGeoError("Zip not found — showing Little Rock, AR.");
        setMapCenter(DEFAULT_CENTER);
      }
    } catch {
      setGeoError("Could not locate zip code — showing Little Rock, AR.");
      setMapCenter(DEFAULT_CENTER);
    } finally {
      setGeocoding(false);
      setSearchedZip(trimmed);
      setSearched(true);
      setSearchKey((k) => k + 1);
    }
  }, [zip]);

  /* ── GPS / Use my location ── */
  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeocoding(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapCenter([coords.latitude, coords.longitude]);
        setSearchedZip("Your location");
        setZip("");
        setSearched(true);
        setSearchKey((k) => k + 1);
        setGeocoding(false);
      },
      () => {
        setGeoError("Could not get your location. Try entering a zip code.");
        setGeocoding(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Find Resources Near You</h1>
        <p className="text-gray-500 text-sm mt-1">
          Free clinics, partner barbershops, mental health, and support groups — filtered by your zip code.
        </p>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Zip input */}
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-black transition-colors">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter zip code (e.g. 72201)"
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                maxLength={5}
              />
            </div>

            {/* Search */}
            <Button onClick={handleSearch} disabled={geocoding} className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              {geocoding ? "Locating…" : "Search"}
            </Button>

            {/* GPS */}
            <Button
              variant="outline"
              onClick={handleGPS}
              disabled={geocoding}
              className="shrink-0 gap-2"
              title="Use my current location"
            >
              <Navigation className="h-4 w-4" />
              <span className="hidden sm:inline">Use My Location</span>
            </Button>

            {/* Free toggle */}
            <Button
              variant={freeOnly ? "default" : "outline"}
              onClick={() => setFreeOnly((p) => !p)}
              className="shrink-0 gap-2"
            >
              <Filter className="h-4 w-4" />
              Free Only
            </Button>
          </div>

          {/* Radius filter */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-500 font-medium shrink-0">Radius:</span>
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRadius(opt.value)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
                  radius === opt.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {geoError && <p className="text-xs text-amber-600 mt-2">{geoError}</p>}
        </CardContent>
      </Card>

      {searched && (
        <>
          {/* Category filters */}
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

          {/* Mobile List/Map toggle */}
          <div className="flex lg:hidden gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setMobileView("list")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                mobileView === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              )}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setMobileView("map")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                mobileView === "map" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              )}
            >
              <Map className="h-3.5 w-3.5" /> Map
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Resource list */}
            <div
              className={cn(
                "lg:col-span-3 space-y-3",
                mobileView === "map" ? "hidden lg:block" : "block"
              )}
            >
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filtered.length} resources</span>{" "}
                near {searchedZip}
                {radius !== "all" && (
                  <span className="text-gray-400"> within {radius} mi</span>
                )}
              </p>

              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    No resources match those filters.{" "}
                    {radius !== "all" && "Try increasing the radius or "}
                    try removing &quot;Free Only.&quot;
                  </p>
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
                        {r.free && <Badge variant="green" size="sm">Free</Badge>}
                        <Badge className={cn("text-xs", TYPE_COLORS[r.type])} size="sm">
                          {CATEGORIES.find((c) => c.id === r.type)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {r.address}, {r.city}
                        <span className="text-gray-300">·</span>
                        <span className="font-medium text-teal-600">{formatDist(r.dist)}</span>
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
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-gray-400 transition-transform",
                          selected === r.id && "rotate-90"
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {selected === r.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 animate-fade-in">
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">Phone</div>
                        <a
                          href={`tel:${r.phone}`}
                          className="text-sm font-medium text-black flex items-center gap-1.5 hover:underline"
                        >
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

            {/* Live Leaflet Map */}
            <div
              className={cn(
                "lg:col-span-2",
                mobileView === "list" ? "hidden lg:block" : "block"
              )}
            >
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Map — {searchedZip}</p>
                    {radius !== "all" && (
                      <span className="text-xs text-gray-400">within {radius} mi</span>
                    )}
                  </div>
                  <div className="h-[480px]">
                    <ResourceMap
                      resources={mapResources}
                      selected={selected}
                      center={mapCenter}
                      searchKey={searchKey}
                      onSelect={(id) => setSelected((prev) => (prev === id ? null : id))}
                    />
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
