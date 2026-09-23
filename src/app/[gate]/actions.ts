"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { verifyGatePassword, setGateCookie, hasValidGateCookie } from "@/lib/privateGate";
import {
  listEventsForMonth,
  createEvent,
  updateEvent,
  deleteEvent,
  type CalendarEvent,
} from "@/lib/calendarEvents";
import {
  listTodos,
  createTodo,
  setTodoDone,
  deleteTodo,
  getTodoText,
  type Todo,
} from "@/lib/todos";
import { getCatCare, markFed, markWatered, type CatCare } from "@/lib/catCare";
import { recordFailedAttempt, listRecentAttempts, type GateAttempt } from "@/lib/gateAttempts";
import { getStatus, setStatus } from "@/lib/siteStatus";

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
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = headerList.get("user-agent") ?? "unknown";
    const sendEmail = await recordFailedAttempt(ip, userAgent);
    after(sendEmail);
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

export async function fetchTodos(): Promise<Todo[]> {
  await requireAuth();
  return listTodos();
}

export async function addTodo(text: string): Promise<void> {
  await requireAuth();
  const trimmed = text.trim();
  if (!trimmed) return;
  await createTodo(trimmed);
}

export async function setTodoDoneAction(id: number, done: boolean): Promise<void> {
  await requireAuth();
  await setTodoDone(id, done);
}

export async function removeTodo(id: number): Promise<void> {
  await requireAuth();
  await deleteTodo(id);
}

export async function convertTodoToEvent(todoId: number, eventDate: string): Promise<void> {
  await requireAuth();
  const text = await getTodoText(todoId);
  if (!text) return;
  await createEvent({ title: text, eventDate, eventTime: null, notes: null });
  await deleteTodo(todoId);
}

export async function fetchCatCare(): Promise<CatCare> {
  await requireAuth();
  return getCatCare();
}

export async function markCatFed(): Promise<void> {
  await requireAuth();
  await markFed();
}

export async function markCatWatered(): Promise<void> {
  await requireAuth();
  await markWatered();
}

export async function fetchRecentAttempts(): Promise<GateAttempt[]> {
  await requireAuth();
  return listRecentAttempts();
}

export async function fetchStatus(): Promise<string> {
  await requireAuth();
  return getStatus();
}

export async function updateStatus(status: string): Promise<void> {
  await requireAuth();
  await setStatus(status.trim());
}
