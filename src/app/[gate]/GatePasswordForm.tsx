"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { unlockGate, type UnlockState } from "./actions";

const initialState: UnlockState = {};

export default function GatePasswordForm() {
  const [state, formAction, pending] = useActionState(unlockGate, initialState);
  const router = useRouter();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current && !pending && !state.error) {
      router.refresh();
    }
  }, [state, pending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-0)] px-4">
      <form
        action={formAction}
        onSubmit={() => {
          submittedRef.current = true;
        }}
        className="hairline flex w-full max-w-xs flex-col gap-3 rounded p-6"
      >
        <input
          name="password"
          type="password"
          autoFocus
          required
          className="hairline w-full rounded bg-transparent px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-[var(--cyan-dim)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="hairline-strong rounded px-4 py-2 font-mono-tech text-sm text-[var(--amber)] transition active:scale-95 hover:bg-[var(--amber)]/10 disabled:opacity-50"
        >
          {pending ? "..." : "Enter"}
        </button>
        {state.error && (
          <span className="font-mono-tech text-xs text-[var(--red)]">{state.error}</span>
        )}
      </form>
    </div>
  );
}
