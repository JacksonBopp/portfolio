import "server-only";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type CalendarEvent = {
  id: number;
  title: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string | null; // HH:MM:SS or null
  notes: string | null;
};

function mapRow(row: {
  id: number;
  title: string;
  event_date: string;
  event_time: string | null;
  notes: string | null;
}): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    eventDate: row.event_date,
    eventTime: row.event_time,
    notes: row.notes,
  };
}

export async function listEventsForMonth(
  year: number,
  month: number, // 1-12
): Promise<CalendarEvent[]> {
  // Cast date/time columns to text in SQL itself: the driver otherwise
  // parses DATE columns into a native JS Date built from the server's
  // local timezone offset (so a plain "2026-09-15" comes back as an object
  // that serializes to "2026-09-15T04:00:00.000Z" or similar), which both
  // breaks the "YYYY-MM-DD" contract this type promises and can shift the
  // date entirely in a timezone where the offset crosses midnight.
  const rows = await sql`
    SELECT id, title, event_date::text AS event_date, event_time::text AS event_time, notes
    FROM events
    WHERE date_part('year', event_date) = ${year}
      AND date_part('month', event_date) = ${month}
    ORDER BY event_date, event_time NULLS LAST
  `;
  return rows.map(mapRow as (row: unknown) => CalendarEvent);
}

export async function createEvent(input: {
  title: string;
  eventDate: string;
  eventTime: string | null;
  notes: string | null;
}): Promise<void> {
  await sql`
    INSERT INTO events (title, event_date, event_time, notes)
    VALUES (${input.title}, ${input.eventDate}, ${input.eventTime}, ${input.notes})
  `;
}

export async function updateEvent(
  id: number,
  input: { title: string; eventDate: string; eventTime: string | null; notes: string | null },
): Promise<void> {
  await sql`
    UPDATE events
    SET title = ${input.title}, event_date = ${input.eventDate},
        event_time = ${input.eventTime}, notes = ${input.notes}
    WHERE id = ${id}
  `;
}

export async function deleteEvent(id: number): Promise<void> {
  await sql`DELETE FROM events WHERE id = ${id}`;
}
