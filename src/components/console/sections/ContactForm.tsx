"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "@/lib/sendContactMessage";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  return (
    <div className="hairline rounded p-5">
      <span className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)]">
        Send a message
      </span>

      <form action={formAction} className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="hairline w-full rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--cyan-dim)]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="hairline w-full rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)] focus:border-[var(--cyan-dim)]"
          />
        </div>
        <textarea
          name="message"
          placeholder="What's up?"
          required
          rows={4}
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
