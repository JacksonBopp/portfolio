"use client";

import { useEffect, useState, useTransition } from "react";
import {
  fetchTodos,
  addTodo,
  setTodoDoneAction,
  removeTodo,
  convertTodoToEvent,
} from "@/app/[gate]/actions";
import type { Todo } from "@/lib/todos";

export default function TodoList({ onEventCreated }: { onEventCreated?: () => void } = {}) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [movingId, setMovingId] = useState<number | null>(null);
  const [moveDate, setMoveDate] = useState("");
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      setTodos(await fetchTodos());
    });
  }

  useEffect(() => {
    reload();
  }, []);

  function handleAdd() {
    if (!text.trim()) return;
    startTransition(async () => {
      await addTodo(text.trim());
      setText("");
      reload();
    });
  }

  function handleToggle(id: number, done: boolean) {
    startTransition(async () => {
      await setTodoDoneAction(id, done);
      reload();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await removeTodo(id);
      reload();
    });
  }

  function handleMoveConfirm() {
    if (movingId === null || !moveDate) return;
    startTransition(async () => {
      await convertTodoToEvent(movingId, moveDate);
      setMovingId(null);
      setMoveDate("");
      reload();
      onEventCreated?.();
    });
  }

  return (
    <div className="hairline rounded p-5" style={{ fontFamily: "var(--font-kalam)" }}>
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        To-do
      </span>

      <ul className="mt-3 flex flex-col gap-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 text-base">
            <span className="text-[var(--amber)]">•</span>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => handleToggle(todo.id, e.target.checked)}
              className="h-4 w-4 accent-[var(--amber)]"
            />
            <span
              className={todo.done ? "flex-1 text-[var(--fg-dim)] line-through" : "flex-1 text-[var(--fg)]"}
            >
              {todo.text}
            </span>
            <button
              onClick={() => {
                setMovingId(todo.id);
                setMoveDate("");
              }}
              className="text-sm text-[var(--cyan)] hover:underline"
            >
              → calendar
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-sm text-[var(--red)] hover:underline"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      {movingId !== null && (
        <div className="mt-3 flex items-center gap-2 border-t border-[var(--hairline)] pt-3">
          <input
            type="date"
            value={moveDate}
            onChange={(e) => setMoveDate(e.target.value)}
            className="hairline rounded bg-transparent px-2 py-1 text-sm outline-none"
          />
          <button
            onClick={handleMoveConfirm}
            disabled={!moveDate}
            className="hairline-strong rounded px-3 py-1 text-sm text-[var(--amber)] hover:bg-[var(--amber)]/10 disabled:opacity-50"
          >
            Move
          </button>
          <button onClick={() => setMovingId(null)} className="text-sm text-[var(--fg-dim)]">
            cancel
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-[var(--hairline)] pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a to-do"
          className="hairline flex-1 rounded bg-transparent px-2 py-1.5 text-base outline-none focus:border-[var(--cyan-dim)]"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="hairline-strong rounded px-3 py-1.5 font-mono-tech text-sm text-[var(--amber)] hover:bg-[var(--amber)]/10 disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
