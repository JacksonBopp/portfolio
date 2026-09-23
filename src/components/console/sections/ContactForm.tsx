"use client";

import { useActionState, useState } from "react";
import { sendContactMessage, type ContactFormState } from "@/lib/sendContactMessage";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [renderedAt] = useState(() => Date.now());

  return (
    <div className="hairline rounded p-5">
      <span className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)]">
        Send a message
      </span>

      <form action={formAction} className="mt-3 flex flex-col gap-3">
        <input type="hidden" name="renderedAt" value={renderedAt} />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 opacity-0"
          style={{ left: "-9999px" }}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            maxLength={100}
            className="hairline w-full rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--cyan-dim)]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            maxLength={254}
            className="hairline w-full rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--cyan-dim)]"
          />
        </div>
        <textarea
          name="message"
          placeholder="What's up?"
          required
          rows={4}
          maxLength={5000}
          className="hairline w-full resize-none rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--cyan-dim)]"
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="hairline-strong inline-flex w-fit items-center gap-2 rounded px-4 py-2 font-mono-tech text-sm text-[var(--amber)] transition active:scale-95 hover:bg-[var(--amber)]/10 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send ↗"}
          </button>
          {state.status !== "idle" && state.message && (
            <span
              className={`font-mono-tech text-xs ${
                state.status === "success" ? "text-[var(--green)]" : "text-[var(--red)]"
              }`}
            >
              {state.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
