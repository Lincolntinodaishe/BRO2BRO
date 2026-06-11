/**
 * Shared demo narrative connecting member, barber, and mentor hackathon accounts.
 * Marcus Williams (barber client) = Marcus J. (member) = Raymond T.'s mentee (mentor).
 */
export const DEMO_ECOSYSTEM = {
  member: {
    email: "test@gmail.com",
    name: "Marcus J.",
    fullName: "Marcus Williams",
    phone: "(501) 555-0142",
    city: "Little Rock, AR",
    focus: ["Blood Pressure", "Mental Wellness"],
    age: 42,
  },
  barber: {
    email: "barber@gmail.com",
    name: "Joe T.",
    shop: "Joe's Classic Cuts",
  },
  mentor: {
    email: "mentor@gmail.com",
    name: "Raymond T.",
    title: "Peer Health Mentor",
    specialties: ["Blood Pressure", "Mental Wellness", "Accountability"],
  },
} as const;

export const MARCUS_MENTEE_ID = "mentee-marcus";
