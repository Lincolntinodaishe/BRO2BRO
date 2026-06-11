"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import {
  loadMentorMentees,
  loadMentorSessions,
  loadMentorMessages,
  saveMentorMentees,
  saveMentorSessions,
  saveMentorMessages,
} from "@/lib/mentor-store";
import {
  DEMO_MENTEES,
  DEMO_MENTOR_SESSIONS,
  DEMO_MENTOR_MESSAGES,
  DEMO_MENTOR_STATS,
  EMPTY_MENTOR_STATS,
  type MentorMentee,
  type MentorSession,
  type MentorMessage,
  type MentorStat,
} from "@/lib/demo-mentor-data";

interface MentorDataContextValue {
  loading: boolean;
  mentees: MentorMentee[];
  sessions: MentorSession[];
  messages: MentorMessage[];
  stats: MentorStat[];
  upcomingSessions: MentorSession[];
  activeMentees: MentorMentee[];
  unreadCount: number;
  setMentees: (next: MentorMentee[]) => Promise<void>;
  setSessions: (next: MentorSession[]) => Promise<void>;
  setMessages: (next: MentorMessage[]) => Promise<void>;
  updateMentee: (id: string, patch: Partial<MentorMentee>) => Promise<void>;
  addSession: (session: MentorSession) => Promise<void>;
  updateSession: (id: string, patch: Partial<MentorSession>) => Promise<void>;
  sendMessage: (msg: MentorMessage) => Promise<void>;
  markMessagesRead: (menteeId: string) => Promise<void>;
}

const MentorDataContext = createContext<MentorDataContextValue | null>(null);

export function MentorDataProvider({ children }: { children: ReactNode }) {
  const { user, isMentorDemo } = useAuth();
  const [mentees, setMenteesState] = useState<MentorMentee[]>([]);
  const [sessions, setSessionsState] = useState<MentorSession[]>([]);
  const [messages, setMessagesState] = useState<MentorMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      loadMentorMentees(user.uid),
      loadMentorSessions(user.uid),
      loadMentorMessages(user.uid),
    ])
      .then(([m, s, msg]) => {
        const hasData = m.length + s.length > 0;
        if (isMentorDemo && !hasData) {
          setMenteesState(DEMO_MENTEES);
          setSessionsState(DEMO_MENTOR_SESSIONS);
          setMessagesState(DEMO_MENTOR_MESSAGES);
        } else if (isMentorDemo && hasData) {
          setMenteesState(m.length ? m : DEMO_MENTEES);
          setSessionsState(s.length ? s : DEMO_MENTOR_SESSIONS);
          setMessagesState(msg.length ? msg : DEMO_MENTOR_MESSAGES);
        } else {
          setMenteesState(m);
          setSessionsState(s);
          setMessagesState(msg);
        }
      })
      .finally(() => setLoading(false));
  }, [user, isMentorDemo]);

  const persistMentees = useCallback(
    async (next: MentorMentee[]) => {
      setMenteesState(next);
      if (user) await saveMentorMentees(user.uid, next);
    },
    [user]
  );

  const persistSessions = useCallback(
    async (next: MentorSession[]) => {
      setSessionsState(next);
      if (user) await saveMentorSessions(user.uid, next);
    },
    [user]
  );

  const persistMessages = useCallback(
    async (next: MentorMessage[]) => {
      setMessagesState(next);
      if (user) await saveMentorMessages(user.uid, next);
    },
    [user]
  );

  const stats = useMemo((): MentorStat[] => {
    if (isMentorDemo && mentees.length === 0) return DEMO_MENTOR_STATS;
    if (mentees.length === 0) return EMPTY_MENTOR_STATS;
    const active = mentees.filter((m) => m.status === "active").length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    const avgStreak = mentees.length
      ? Math.round(mentees.reduce((a, m) => a + m.streak, 0) / mentees.length)
      : 0;
    return [
      { label: "Active Mentees", value: String(active), delta: `${mentees.length} total` },
      { label: "Sessions Held", value: String(completed), delta: `${sessions.filter((s) => s.status === "upcoming").length} upcoming` },
      { label: "Avg. Streak", value: avgStreak ? `${avgStreak} days` : "—", delta: "Check-in consistency" },
      { label: "Impact Score", value: active > 0 ? "96%" : "—", delta: active > 0 ? "Keep it up" : "Onboard mentees" },
    ];
  }, [isMentorDemo, mentees, sessions]);

  const value = useMemo<MentorDataContextValue>(
    () => ({
      loading,
      mentees,
      sessions,
      messages,
      stats,
      upcomingSessions: sessions.filter((s) => s.status === "upcoming"),
      activeMentees: mentees.filter((m) => m.status === "active" || m.status === "new"),
      unreadCount: messages.filter((m) => !m.read && m.sender === "mentee").length,
      setMentees: persistMentees,
      setSessions: persistSessions,
      setMessages: persistMessages,
      updateMentee: async (id, patch) => {
        await persistMentees(mentees.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      },
      addSession: async (session) => {
        await persistSessions([session, ...sessions]);
      },
      updateSession: async (id, patch) => {
        await persistSessions(sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      },
      sendMessage: async (msg) => {
        await persistMessages([msg, ...messages]);
      },
      markMessagesRead: async (menteeId) => {
        await persistMessages(
          messages.map((m) =>
            m.menteeId === menteeId && m.sender === "mentee" ? { ...m, read: true } : m
          )
        );
        await persistMentees(
          mentees.map((m) => (m.id === menteeId ? { ...m, unread: 0 } : m))
        );
      },
    }),
    [loading, mentees, sessions, messages, stats, persistMentees, persistSessions, persistMessages]
  );

  return (
    <MentorDataContext.Provider value={value}>{children}</MentorDataContext.Provider>
  );
}

export function useMentorData() {
  const ctx = useContext(MentorDataContext);
  if (!ctx) throw new Error("useMentorData must be used within MentorDataProvider");
  return ctx;
}
