"use client";
import { useState } from "react";
import {
  Star, MessageCircle, Calendar, CheckCircle,
  Search, Filter, MapPin, Heart, Award, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { DEMO_MEMBER_MENTOR } from "@/lib/demo-mentor-data";

interface Mentor {
  id: string;
  name: string;
  title: string;
  location: string;
  specialties: string[];
  bio: string;
  rating: number;
  reviews: number;
  sessions: number;
  available: boolean;
  verified: boolean;
  format: "virtual" | "in-person" | "both";
  isYourMentor?: boolean;
  nextSession?: string;
}

const MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Coach Ray T.",
    title: "Health & Fitness Mentor",
    location: "Little Rock, AR",
    specialties: ["Diabetes Management", "Weight Loss", "Fitness"],
    bio: "Diagnosed with Type 2 diabetes at 38. Lost 60 lbs in 18 months through diet and walking. Now I help other men navigate the same journey — no gimmicks, no judgment.",
    rating: 4.9,
    reviews: 47,
    sessions: 120,
    available: true,
    verified: true,
    format: "both",
  },
  {
    id: "2",
    name: "Marcus H.",
    title: "Mental Wellness Peer Mentor",
    location: "Pine Bluff, AR",
    specialties: ["Anxiety", "Work Stress", "Depression"],
    bio: "Went through severe burnout and depression in my 30s. Found my way through therapy, community, and honest conversations. If you need someone who gets it without the clinical distance — I'm here.",
    rating: 4.8,
    reviews: 31,
    sessions: 89,
    available: true,
    verified: true,
    format: "virtual",
  },
  {
    id: "3",
    name: "Pastor James B.",
    title: "Community & Spiritual Mentor",
    location: "Little Rock, AR",
    specialties: ["Family", "Purpose", "Community Leadership"],
    bio: "35 years pastoring and counseling. I've walked with men through addiction, incarceration, grief, and rebuilding. There's nothing you can bring that I haven't seen — and found a way through.",
    rating: 4.9,
    reviews: 62,
    sessions: 210,
    available: false,
    verified: true,
    format: "in-person",
  },
  {
    id: "4",
    name: "DeShawn P.",
    title: "Recovery & Substance Use Mentor",
    location: "Jonesboro, AR",
    specialties: ["Substance Use", "Recovery", "Accountability"],
    bio: "7 years clean. I know what it takes — and I know how much harder it is when you feel like you have to do it alone. You don't.",
    rating: 4.7,
    reviews: 28,
    sessions: 75,
    available: true,
    verified: true,
    format: "both",
  },
  {
    id: "5",
    name: "Terrence W.",
    title: "Career & Stress Mentor",
    location: "North Little Rock, AR",
    specialties: ["Career Stress", "Financial Wellness", "Work-Life Balance"],
    bio: "Corporate career, two heart attacks by 44. Now I coach men on sustainable success — how to build without burning out. Your health is your greatest career asset.",
    rating: 4.6,
    reviews: 19,
    sessions: 54,
    available: true,
    verified: false,
    format: "virtual",
  },
  {
    id: "6",
    name: "Antoine L.",
    title: "Father & Family Mentor",
    location: "Conway, AR",
    specialties: ["Fatherhood", "Relationships", "Parenting"],
    bio: "Single dad of three, raised them right. If you're trying to figure out how to be present for your kids while dealing with everything else life throws at you — let's talk.",
    rating: 4.8,
    reviews: 22,
    sessions: 67,
    available: true,
    verified: true,
    format: "both",
  },
];

const SPECIALTIES = ["All", "Mental Health", "Physical Health", "Substance Use", "Family", "Career", "Fitness"];

function MentorCard({ mentor, onConnect }: { mentor: Mentor; onConnect: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={cn(
      "hover:shadow-card-hover transition-shadow duration-300",
      !mentor.available && "opacity-70",
      mentor.isYourMentor && "ring-2 ring-teal-500/30 border-teal-100"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <Avatar name={mentor.name} size="lg" online={mentor.available} />
            {mentor.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{mentor.name}</h3>
                <p className="text-xs text-gray-500">{mentor.title}</p>
              </div>
              {mentor.isYourMentor
                ? <Badge className="bg-teal-50 text-teal-700 border-teal-200" size="sm">Your Mentor</Badge>
                : mentor.available
                  ? <Badge variant="success" size="sm">Available</Badge>
                  : <Badge variant="secondary" size="sm">Busy</Badge>}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <MapPin className="h-3 w-3" />
              {mentor.location}
              <span className="text-gray-200">·</span>
              {mentor.format === "both" ? "Virtual & In-person"
                : mentor.format === "virtual" ? "Virtual only"
                : "In-person only"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-800">{mentor.rating}</span>
            ({mentor.reviews})
          </span>
          <span>{mentor.sessions} sessions</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {mentor.specialties.map((s) => (
            <Badge key={s} variant="secondary" size="sm">{s}</Badge>
          ))}
        </div>

        <p className={cn("text-xs text-gray-600 leading-relaxed", !expanded && "line-clamp-2")}>
          {mentor.bio}
        </p>
        {mentor.bio.length > 100 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-gray-400 hover:text-black mt-1 transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {mentor.nextSession && (
          <p className="text-xs text-teal-700 font-medium mt-3 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Next session: {mentor.nextSession}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="flex-1"
            disabled={!mentor.available && !mentor.isYourMentor}
            onClick={() => onConnect(mentor.id)}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            {mentor.isYourMentor ? "Message" : "Connect"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectModal({ mentorId, onClose, mentors }: { mentorId: string; onClose: () => void; mentors: Mentor[] }) {
  const mentor = mentors.find((m) => m.id === mentorId);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!mentor) return null;

  async function handleSend() {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-float">
        {sent ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-sm text-gray-500 mb-6">
              {mentor.name} will respond within 24–48 hours. You&apos;ll get a notification when they accept.
            </p>
            <Button onClick={onClose} className="w-full">Back to Mentors</Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Connect with {mentor.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <Avatar name={mentor.name} size="md" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{mentor.name}</div>
                  <div className="text-xs text-gray-500">{mentor.title}</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Introduce yourself and what you&apos;re working through
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Be as open or as brief as you want — there's no wrong way to start…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors resize-none"
                />
              </div>
              <p className="text-xs text-gray-400">
                Your message is private. {mentor.name} can only see your first name and what you share here.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button disabled={!message.trim()} onClick={handleSend}>
                Send Request <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MentorsPage() {
  const { isTestAccount } = useAuth();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  const allMentors: Mentor[] = isTestAccount
    ? [DEMO_MEMBER_MENTOR, ...MENTORS.filter((m) => m.name !== DEMO_MEMBER_MENTOR.name)]
    : MENTORS;

  const filtered = allMentors.filter((m) => {
    if (availableOnly && !m.available) return false;
    if (specialty !== "All" && !m.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()))) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.bio.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Mentors</h1>
          <p className="text-gray-500 text-sm mt-1">
            Peer mentors who&apos;ve been through it — real men, real journeys.
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Heart className="h-4 w-4 text-amber-500" />
          Become a Mentor
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <Award className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900">All mentors are community-verified</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Verified mentors have completed background checks and BRO2BRO&apos;s peer mentor training. They are not medical professionals — they are men who&apos;ve navigated what you&apos;re facing.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or topic…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        <Button
          variant={availableOnly ? "default" : "outline"}
          onClick={() => setAvailableOnly((p) => !p)}
          className="gap-2 shrink-0"
        >
          <Filter className="h-4 w-4" />
          Available Now
        </Button>
      </div>

      {/* Specialty pills */}
      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              specialty === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="my">My Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mt-4">
              <MessageCircle className="h-10 w-10 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No mentors match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {filtered.map((m) => (
                <MentorCard key={m.id} mentor={m} onConnect={setConnectingTo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my">
          {isTestAccount ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <MentorCard mentor={DEMO_MEMBER_MENTOR} onConnect={setConnectingTo} />
            </div>
          ) : (
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Heart className="h-10 w-10 text-gray-200 mx-auto mb-4" />
              <p className="text-base font-semibold text-gray-700 mb-2">No connections yet</p>
              <p className="text-sm text-gray-500 mb-6">Connect with a mentor and they&apos;ll appear here once they accept.</p>
              <Button variant="outline" onClick={() => {}}>Browse Mentors</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {connectingTo && (
        <ConnectModal mentorId={connectingTo} mentors={allMentors} onClose={() => setConnectingTo(null)} />
      )}
    </div>
  );
}
