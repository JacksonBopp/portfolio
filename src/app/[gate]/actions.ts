"use server";

import { verifyGatePassword, setGateCookie, hasValidGateCookie } from "@/lib/privateGate";
import {
  listEventsForMonth,
  createEvent,
  updateEvent,
  deleteEvent,
  type CalendarEvent,
} from "@/lib/calendarEvents";

export type UnlockState = { error?: string };

// Best-effort per-process rate limit on password attempts, same pattern as
// the contact form's spam guard: not perfect across cold starts, but blunts
// casual brute-forcing of a single-user password gate.
const ATTEMPT_LIMIT = 10;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
let attempts: number[] = [];

export async function unlockGate(
  _prevState: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const now = Date.now();
  attempts = attempts.filter((t) => now - t < ATTEMPT_WINDOW_MS);
  if (attempts.length >= ATTEMPT_LIMIT) {
    return { error: "Too many attempts. Try again later." };
  }
  attempts.push(now);

  const password = String(formData.get("password") ?? "");
  if (!verifyGatePassword(password)) {
    return { error: "Wrong password." };
  }
  await setGateCookie();
  return {};
}

// Every action below touches real data, so each one independently checks
// the auth cookie. The page only controlling what's *rendered* isn't
// enough: a Server Action is its own callable endpoint regardless of which
// branch of the page a client happened to load.
async function requireAuth(): Promise<void> {
  if (!(await hasValidGateCookie())) {
    throw new Error("Not authorized.");
  }
}

export async function fetchMonthEvents(year: number, month: number): Promise<CalendarEvent[]> {
  await requireAuth();
  return listEventsForMonth(year, month);
}

export async function saveEvent(input: {
  id: number | null;
  title: string;
  eventDate: string;
  eventTime: string | null;
  notes: string | null;
}): Promise<void> {
  await requireAuth();
  if (input.id === null) {
    await createEvent(input);
  } else {
    await updateEvent(input.id, input);
  }
}

export async function removeEvent(id: number): Promise<void> {
  await requireAuth();
  await deleteEvent(id);
}
