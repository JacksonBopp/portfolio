"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const SUCCESS: ContactFormState = {
  status: "success",
  message: "Sent. I'll get back to you soon.",
};

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

// Best-effort per-IP rate limit. Resets on cold start and isn't shared across
// concurrent instances, but it's enough to blunt casual abuse without needing
// an external store for a low-traffic portfolio site.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) {
    submissionLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(ip, recent);
  return false;
}

function stripNewlines(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real visitors never fill this in, bots usually do.
  if (String(formData.get("company") ?? "").trim()) {
    return SUCCESS;
  }

  // Bots that submit faster than a human could plausibly fill the form.
  const renderedAt = Number(formData.get("renderedAt") ?? 0);
  if (renderedAt && Date.now() - renderedAt < 2000) {
    return SUCCESS;
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Too many messages sent recently. Try again in a bit.",
    };
  }

  const name = stripNewlines(String(formData.get("name") ?? "")).slice(
    0,
    MAX_NAME_LENGTH,
  );
  const email = stripNewlines(String(formData.get("email") ?? "")).slice(
    0,
    MAX_EMAIL_LENGTH,
  );
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);

  if (!name || !email || !message) {
    return { status: "error", message: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message: "Contact form isn't configured yet. Email me directly instead.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "boppjackson@gmail.com",
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      return { status: "error", message: "Something went wrong sending that. Try again?" };
    }
    return SUCCESS;
  } catch {
    return { status: "error", message: "Something went wrong sending that. Try again?" };
  }
}
