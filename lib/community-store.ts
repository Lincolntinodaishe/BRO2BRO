import { ref, push, onValue, update, get } from "firebase/database";
import { requireDb } from "@/lib/firebase";

export interface FirebasePost {
  id: string;
  author: string;
  authorRole: string;
  timestamp: number;
  category: string;
  title: string;
  body: string;
  likes: number;
  likedBy: Record<string, boolean>;
  pinned?: boolean;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

export function subscribeToPosts(
  callback: (posts: FirebasePost[]) => void,
  onError?: () => void
): () => void {
  const postsRef = ref(requireDb(), "community/posts");
  const unsub = onValue(
    postsRef,
    (snap) => {
      if (!snap.exists()) {
        callback([]);
        return;
      }
      const raw = snap.val() as Record<string, Omit<FirebasePost, "id">>;
      const posts = Object.entries(raw)
        .map(([id, p]) => ({ id, ...p, likedBy: p.likedBy ?? {} }))
        .sort((a, b) => b.timestamp - a.timestamp);
      callback(posts);
    },
    () => onError?.()
  );
  return unsub;
}

export async function createPost(params: {
  author: string;
  authorRole: string;
  category: string;
  title: string;
  body: string;
}): Promise<void> {
  await push(ref(requireDb(), "community/posts"), {
    ...params,
    timestamp: Date.now(),
    likes: 0,
    likedBy: {},
    pinned: false,
  });
}

export async function toggleLike(postId: string, uid: string): Promise<void> {
  const postRef = ref(requireDb(), `community/posts/${postId}`);
  const snap = await get(postRef);
  if (!snap.exists()) return;
  const likedBy: Record<string, boolean> = snap.val().likedBy ?? {};
  if (likedBy[uid]) {
    delete likedBy[uid];
  } else {
    likedBy[uid] = true;
  }
  await update(postRef, { likes: Object.keys(likedBy).length, likedBy });
}
