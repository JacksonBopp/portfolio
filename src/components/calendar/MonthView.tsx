"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchMonthEvents, saveEvent, removeEvent } from "@/app/[gate]/actions";
import type { CalendarEvent } from "@/lib/calendarEvents";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
function firstWeekday(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}
function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function ymd(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export default function MonthView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      const data = await fetchMonthEvents(year, month);
      setEvents(data);
    });
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  function changeMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const numDays = daysInMonth(year, month);
  const startWeekday = firstWeekday(year, month);
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: numDays }, (_, i) => i + 1),
  ];

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  for (const e of events) {
    (eventsByDate[e.eventDate] ??= []).push(e);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] p-6 text-[var(--fg)]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="hairline rounded px-3 py-1 font-mono-tech text-sm hover:border-[var(--amber-dim)]"
          >
            ←
          </button>
          <span className="font-mono-tech text-sm">
            {new Date(year, month - 1).toLocaleString("en-US", { month: "long" })} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="hairline rounded px-3 py-1 font-mono-tech text-sm hover:border-[var(--amber-dim)]"
          >
            →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono-tech text-[10px] text-[var(--fg-dim)]">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`blank-${i}`} />;
            }
            const dateStr = ymd(year, month, day);
            const dayEvents = eventsByDate[dateStr] ?? [];
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className="hairline flex min-h-20 flex-col items-start gap-1 rounded p-1.5 text-left text-xs transition hover:border-[var(--amber-dim)]"
              >
                <span className="font-mono-tech text-[var(--fg-dim)]">{day}</span>
                {dayEvents.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="w-full truncate rounded bg-[var(--amber)]/10 px-1 text-[10px] text-[var(--amber)]"
                  >
                    {e.title}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <DayEditor
          date={selectedDate}
          events={eventsByDate[selectedDate] ?? []}
          onClose={() => setSelectedDate(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

function DayEditor({
  date,
  events,
  onClose,
  onChanged,
}: {
  date: string;
  events: CalendarEvent[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!title.trim()) return;
    startTransition(async () => {
      await saveEvent({
        id: null,
        title: title.trim(),
        eventDate: date,
        eventTime: time || null,
        notes: notes.trim() || null,
      });
      setTitle("");
      setTime("");
      setNotes("");
      onChanged();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await removeEvent(id);
      onChanged();
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <div className="hairline w-full max-w-sm rounded bg-[var(--bg-1)] p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono-tech text-sm text-[var(--amber)]">{date}</span>
          <button onClick={onClose} className="text-[var(--fg-dim)] hover:text-[var(--fg)]">
            ×
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {events.map((e) => (
            <div key={e.id} className="hairline flex items-center justify-between rounded px-2 py-1.5">
              <div className="text-sm">
                <div>{e.title}</div>
                {e.eventTime && (
                  <div className="text-[10px] text-[var(--fg-dim)]">{e.eventTime}</div>
                )}
                {e.notes && <div className="text-[10px] text-[var(--fg-muted)]">{e.notes}</div>}
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                disabled={isPending}
                className="font-mono-tech text-xs text-[var(--red)] hover:underline disabled:opacity-50"
              >
                delete
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--hairline)] pt-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="hairline rounded bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--cyan-dim)]"
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            className="hairline rounded bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--cyan-dim)]"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={2}
            className="hairline resize-none rounded bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--cyan-dim)]"
          />
          <button
            onClick={handleAdd}
            disabled={isPending || !title.trim()}
            className="hairline-strong rounded px-3 py-1.5 font-mono-tech text-sm text-[var(--amber)] hover:bg-[var(--amber)]/10 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
