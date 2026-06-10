"use client";
import { useState } from "react";
import {
  MessageSquare, ThumbsUp, Bookmark, MoreHorizontal,
  Plus, Flame, Clock, TrendingUp, Search, Pin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  author: string;
  authorRole: string;
  time: string;
  category: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  pinned?: boolean;
  liked?: boolean;
}

const POSTS: Post[] = [
  {
    id: "1",
    author: "Marcus W.",
    authorRole: "Member · Pine Bluff",
    time: "2h ago",
    category: "Blood Pressure",
    title: "First time getting my BP checked in 3 years — here's what happened",
    body: "My barber Joe showed me the BRO2BRO QR code and I figured why not. My reading was 148/92 — not great, but I finally know where I stand. Booked an appointment at the UAMS clinic for next week. Just want to share in case someone else is putting it off like I was.",
    likes: 47,
    comments: 12,
    pinned: true,
  },
  {
    id: "2",
    author: "Dre M.",
    authorRole: "Member · Little Rock",
    time: "5h ago",
    category: "Mental Health",
    title: "Finally talked to a therapist. Took me 2 years to make that call.",
    body: "I kept telling myself I didn't need it. Work stress, relationship stuff, all of it building up. The counselor BRO2BRO connected me with works specifically with Black men — that made a difference. Not gonna pretend one session fixed everything, but I feel lighter.",
    likes: 83,
    comments: 21,
  },
  {
    id: "3",
    author: "Coach Ray",
    authorRole: "Mentor · Verified",
    time: "1d ago",
    category: "Fitness",
    title: "30 days of walking 30 minutes a day — my results",
    body: "Started because my doctor said my A1C was creeping up. Nothing fancy — just walking after dinner every night. Down 8 lbs, sleeping better, and my mood is way up. Anyone else doing something simple that's working?",
    likes: 112,
    comments: 34,
  },
  {
    id: "4",
    author: "Trev J.",
    authorRole: "Member · North Little Rock",
    time: "1d ago",
    category: "Nutrition",
    title: "Trying to eat better without giving up all the food I grew up with",
    body: "Been researching how to make traditional dishes healthier — less salt, different cooking oils, more vegetables without sacrificing taste. Found some good resources. Happy to share what I've learned if there's interest.",
    likes: 56,
    comments: 18,
  },
  {
    id: "5",
    author: "Pastor James B.",
    authorRole: "Trustee · Community Leader",
    time: "2d ago",
    category: "Community",
    title: "Free health fair at Greater Christ Temple — this Saturday",
    body: "We're partnering with UAMS and BRO2BRO to host a free health screening this Saturday, 9AM–2PM. Blood pressure, glucose, BMI — all free, no insurance needed. Bring your crew. 2108 S Chester St, Little Rock.",
    likes: 91,
    comments: 8,
    pinned: true,
  },
  {
    id: "6",
    author: "Carlos W.",
    authorRole: "Member · Jonesboro",
    time: "3d ago",
    category: "Milestones",
    title: "Hit my 30-day check-in streak today 🔥",
    body: "I know it sounds small but this is the most consistent I've ever been with my health. Started because my daughter asked me to. If you're just starting out — the first week is the hardest. After that it gets easier.",
    likes: 134,
    comments: 27,
  },
];

const CATEGORIES = ["All", "Blood Pressure", "Mental Health", "Fitness", "Nutrition", "Community", "Milestones"];

const CATEGORY_COLORS: Record<string, string> = {
  "Blood Pressure": "bg-red-50 text-red-700",
  "Mental Health":  "bg-purple-50 text-purple-700",
  "Fitness":        "bg-green-50 text-green-700",
  "Nutrition":      "bg-amber-50 text-amber-700",
  "Community":      "bg-blue-50 text-blue-700",
  "Milestones":     "bg-teal-50 text-teal-700",
};

function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  return (
    <div className={cn("bg-white rounded-2xl border p-5 hover:shadow-card transition-all duration-200", post.pinned ? "border-amber-200" : "border-gray-100")}>
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mb-3">
          <Pin className="h-3 w-3" /> Pinned
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={post.author} size="sm" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{post.author}</div>
            <div className="text-xs text-gray-400">{post.authorRole} · {post.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={cn("text-xs", CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600")} size="sm">
            {post.category}
          </Badge>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.body}</p>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={() => onLike(post.id)}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            post.liked ? "text-amber-600 font-medium" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", post.liked && "fill-amber-600")} />
          {post.likes + (post.liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <MessageSquare className="h-4 w-4" />
          {post.comments}
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
}

function NewPostModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Community");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-float">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    category === c ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Title"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your story</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Share what's working, what you're struggling with, or what you've learned…"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors resize-none"
            />
          </div>
          <p className="text-xs text-gray-400">
            This is a private, Black-men-first space. Be real, be kind, and respect privacy.
          </p>
        </div>
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!title.trim() || !body.trim()} onClick={onClose}>Post to Community</Button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState(POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  function toggleLike(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked } : p));
  }

  const filtered = posts.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Community</h1>
          <p className="text-gray-500 text-sm mt-1">A private space for Black men to connect, share, and support each other.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> New Post
        </Button>
      </div>

      <Tabs defaultValue="trending">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="trending"><Flame className="h-3.5 w-3.5 mr-1.5" />Trending</TabsTrigger>
            <TabsTrigger value="recent"><Clock className="h-3.5 w-3.5 mr-1.5" />Recent</TabsTrigger>
            <TabsTrigger value="top"><TrendingUp className="h-3.5 w-3.5 mr-1.5" />Top</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors w-56"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mt-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeCategory === c ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <div className="lg:col-span-2 space-y-4">
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No posts match your search.</p>
                </div>
              )}
              {filtered.map((p) => <PostCard key={p.id} post={p} onLike={toggleLike} />)}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Community Guidelines</h3>
                  <ul className="space-y-2 text-xs text-gray-500">
                    {[
                      "Respect and uplift — no put-downs",
                      "Real talk only — no spam or self-promotion",
                      "Protect privacy — no screenshots or doxxing",
                      "Medical questions → always see a professional",
                      "Crisis? Text 988, don't wait for replies",
                    ].map((g) => (
                      <li key={g} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Active This Week</h3>
                  <div className="space-y-3">
                    {["Marcus W.", "Coach Ray", "Dre M.", "Carlos W.", "Trev J."].map((name, i) => (
                      <div key={name} className="flex items-center gap-2.5">
                        <Avatar name={name} size="xs" online={i < 2} />
                        <span className="text-xs text-gray-700 flex-1">{name}</span>
                        <span className="text-xs text-gray-400">{[12, 8, 6, 5, 4][i]} posts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4 mt-2">
            {[...filtered].reverse().map((p) => <PostCard key={p.id} post={p} onLike={toggleLike} />)}
          </div>
        </TabsContent>

        <TabsContent value="top">
          <div className="space-y-4 mt-2">
            {[...filtered].sort((a, b) => b.likes - a.likes).map((p) => <PostCard key={p.id} post={p} onLike={toggleLike} />)}
          </div>
        </TabsContent>
      </Tabs>

      {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
