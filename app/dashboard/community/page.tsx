"use client";
import { useState, useEffect } from "react";
import {
  MessageSquare, ThumbsUp, Bookmark, MoreHorizontal,
  Plus, Flame, Clock, TrendingUp, Search, Pin, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeToPosts, createPost, toggleLike, timeAgo,
  type FirebasePost,
} from "@/lib/community-store";

/* ── Hardcoded fallback posts (shown when Firebase is not configured) ── */
const FALLBACK_POSTS: FirebasePost[] = [
  {
    id: "1", author: "Marcus W.", authorRole: "Member · Pine Bluff",
    timestamp: Date.now() - 2 * 3600000, category: "Blood Pressure",
    title: "First time getting my BP checked in 3 years — here's what happened",
    body: "My barber Joe showed me the BRO2BRO QR code and I figured why not. My reading was 148/92 — not great, but I finally know where I stand. Booked an appointment at the UAMS clinic for next week. Just want to share in case someone else is putting it off like I was.",
    likes: 47, likedBy: {}, pinned: true,
  },
  {
    id: "2", author: "Dre M.", authorRole: "Member · Little Rock",
    timestamp: Date.now() - 5 * 3600000, category: "Mental Health",
    title: "Finally talked to a therapist. Took me 2 years to make that call.",
    body: "I kept telling myself I didn't need it. Work stress, relationship stuff, all of it building up. The counselor BRO2BRO connected me with works specifically with Black men — that made a difference.",
    likes: 83, likedBy: {},
  },
  {
    id: "3", author: "Coach Ray", authorRole: "Mentor · Verified",
    timestamp: Date.now() - 24 * 3600000, category: "Fitness",
    title: "30 days of walking 30 minutes a day — my results",
    body: "Started because my doctor said my A1C was creeping up. Nothing fancy — just walking after dinner every night. Down 8 lbs, sleeping better, and my mood is way up.",
    likes: 112, likedBy: {},
  },
  {
    id: "4", author: "Trev J.", authorRole: "Member · North Little Rock",
    timestamp: Date.now() - 26 * 3600000, category: "Nutrition",
    title: "Trying to eat better without giving up all the food I grew up with",
    body: "Been researching how to make traditional dishes healthier — less salt, different cooking oils, more vegetables without sacrificing taste.",
    likes: 56, likedBy: {},
  },
  {
    id: "5", author: "Pastor James B.", authorRole: "Trustee · Community Leader",
    timestamp: Date.now() - 2 * 24 * 3600000, category: "Community",
    title: "Free health fair at Greater Christ Temple — this Saturday",
    body: "We're partnering with UAMS and BRO2BRO to host a free health screening this Saturday, 9AM–2PM. Blood pressure, glucose, BMI — all free, no insurance needed.",
    likes: 91, likedBy: {}, pinned: true,
  },
  {
    id: "6", author: "Carlos W.", authorRole: "Member · Jonesboro",
    timestamp: Date.now() - 3 * 24 * 3600000, category: "Milestones",
    title: "Hit my 30-day check-in streak today 🔥",
    body: "I know it sounds small but this is the most consistent I've ever been with my health. Started because my daughter asked me to.",
    likes: 134, likedBy: {},
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

/* ── Post card ───────────────────────────────────────────────────────── */
function PostCard({
  post, uid, onLike, likeLoading,
}: {
  post: FirebasePost;
  uid?: string;
  onLike: (id: string) => void;
  likeLoading: string | null;
}) {
  const liked = uid ? !!post.likedBy?.[uid] : false;

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
            <div className="text-xs text-gray-400">{post.authorRole} · {timeAgo(post.timestamp)}</div>
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
          disabled={likeLoading === post.id}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            liked ? "text-amber-600 font-medium" : "text-gray-400 hover:text-gray-700",
            "disabled:opacity-50"
          )}
        >
          {likeLoading === post.id
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <ThumbsUp className={cn("h-4 w-4", liked && "fill-amber-600")} />
          }
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <MessageSquare className="h-4 w-4" />
          0
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
}

/* ── New post modal ──────────────────────────────────────────────────── */
function NewPostModal({
  onClose, onSubmit, submitting,
}: {
  onClose: () => void;
  onSubmit: (data: { title: string; body: string; category: string }) => Promise<void>;
  submitting: boolean;
}) {
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [category, setCategory] = useState("Community");

  async function handlePost() {
    if (!title.trim() || !body.trim()) return;
    await onSubmit({ title: title.trim(), body: body.trim(), category });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-float">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">New Post</h2>
          <button onClick={onClose} disabled={submitting} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
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
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button
            disabled={!title.trim() || !body.trim() || submitting}
            onClick={handlePost}
          >
            {submitting ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Posting…</> : "Post to Community"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function CommunityPage() {
  const { user, displayName, userRole } = useAuth();
  const [posts,          setPosts]          = useState<FirebasePost[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [firebaseActive, setFirebaseActive] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [showModal,      setShowModal]      = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [likeLoading,    setLikeLoading]    = useState<string | null>(null);

  /* Subscribe to Firebase posts (or fall back to hardcoded) */
  useEffect(() => {
    try {
      const unsub = subscribeToPosts((firePosts) => {
        setPosts(firePosts);
        setLoading(false);
      });
      return unsub;
    } catch {
      setPosts(FALLBACK_POSTS);
      setLoading(false);
      setFirebaseActive(false);
    }
  }, []);

  /* Build the author role label */
  function authorRoleLabel(): string {
    if (userRole === "mentor") return "Mentor · Verified";
    if (userRole === "barber") return "Barber · Verified";
    return "Member";
  }

  async function handleNewPost(data: { title: string; body: string; category: string }) {
    if (!user) return;
    setSubmitting(true);
    try {
      if (firebaseActive) {
        await createPost({
          author:     displayName || user.email || "Anonymous",
          authorRole: authorRoleLabel(),
          category:   data.category,
          title:      data.title,
          body:       data.body,
        });
      } else {
        /* Optimistic local insert when Firebase is unavailable */
        const newPost: FirebasePost = {
          id:         String(Date.now()),
          author:     displayName || "You",
          authorRole: authorRoleLabel(),
          timestamp:  Date.now(),
          category:   data.category,
          title:      data.title,
          body:       data.body,
          likes:      0,
          likedBy:    {},
        };
        setPosts((prev) => [newPost, ...prev]);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(postId: string) {
    if (!user) return;
    if (!firebaseActive) {
      /* Optimistic local toggle */
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const liked = !!p.likedBy?.[user.uid];
          const likedBy = { ...p.likedBy };
          if (liked) delete likedBy[user.uid]; else likedBy[user.uid] = true;
          return { ...p, likes: Object.keys(likedBy).length, likedBy };
        })
      );
      return;
    }
    setLikeLoading(postId);
    try {
      await toggleLike(postId, user.uid);
    } finally {
      setLikeLoading(null);
    }
  }

  const filtered = posts.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byTrending = [...filtered].sort((a, b) => (b.likes * 2 + b.timestamp / 1e9) - (a.likes * 2 + a.timestamp / 1e9));
  const byRecent   = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
  const byTop      = [...filtered].sort((a, b) => b.likes - a.likes);

  function PostList({ items }: { items: FirebasePost[] }) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">No posts yet.</p>
          <p className="text-gray-400 text-xs mt-1">Be the first to share something.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {items.map((p) => (
          <PostCard key={p.id} post={p} uid={user?.uid} onLike={handleLike} likeLoading={likeLoading} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <div className="lg:col-span-2">
              <PostList items={byTrending} />
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
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    {posts.length} {posts.length === 1 ? "Post" : "Posts"} in Community
                  </h3>
                  <p className="text-xs text-gray-400">Share your story and connect with brothers on the same journey.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="mt-2"><PostList items={byRecent} /></div>
        </TabsContent>

        <TabsContent value="top">
          <div className="mt-2"><PostList items={byTop} /></div>
        </TabsContent>
      </Tabs>

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPost}
          submitting={submitting}
        />
      )}
    </div>
  );
}
