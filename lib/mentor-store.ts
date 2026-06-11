import { ref, get, set } from "firebase/database";
import { requireDb } from "@/lib/firebase";
import type { MentorMentee, MentorSession, MentorMessage } from "@/lib/demo-mentor-data";
import {
  DEMO_MENTEES,
  DEMO_MENTOR_SESSIONS,
  DEMO_MENTOR_MESSAGES,
} from "@/lib/demo-mentor-data";

function mentorRef(uid: string, key: string) {
  return ref(requireDb(), `users/${uid}/mentor/${key}`);
}

export async function loadMentorMentees(uid: string): Promise<MentorMentee[]> {
  const snap = await get(mentorRef(uid, "mentees"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, MentorMentee>);
}

export async function saveMentorMentees(uid: string, mentees: MentorMentee[]): Promise<void> {
  const obj = mentees.reduce<Record<string, MentorMentee>>(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {}
  );
  await set(mentorRef(uid, "mentees"), obj);
}

export async function loadMentorSessions(uid: string): Promise<MentorSession[]> {
  const snap = await get(mentorRef(uid, "sessions"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, MentorSession>);
}

export async function saveMentorSessions(uid: string, sessions: MentorSession[]): Promise<void> {
  const obj = sessions.reduce<Record<string, MentorSession>>(
    (acc, s) => ({ ...acc, [s.id]: s }),
    {}
  );
  await set(mentorRef(uid, "sessions"), obj);
}

export async function loadMentorMessages(uid: string): Promise<MentorMessage[]> {
  const snap = await get(mentorRef(uid, "messages"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, MentorMessage>);
}

export async function saveMentorMessages(uid: string, messages: MentorMessage[]): Promise<void> {
  const obj = messages.reduce<Record<string, MentorMessage>>(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {}
  );
  await set(mentorRef(uid, "messages"), obj);
}

export async function seedMentorDemoData(uid: string): Promise<void> {
  await Promise.all([
    saveMentorMentees(uid, DEMO_MENTEES),
    saveMentorSessions(uid, DEMO_MENTOR_SESSIONS),
    saveMentorMessages(uid, DEMO_MENTOR_MESSAGES),
  ]);
}
