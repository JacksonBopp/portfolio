import "server-only";
import { sql } from "./db";

export type CatCare = {
  lastFed: string | null; // ISO 8601
  lastWatered: string | null; // ISO 8601
};

// Unlike the DATE columns in calendarEvents.ts, a TIMESTAMPTZ has no
// timezone ambiguity to worry about: the driver parses it into a JS Date
// representing the correct absolute instant either way. We just normalize
// it to an ISO string here so it serializes cleanly across the Server
// Action boundary and is easy to diff against `Date.now()` on the client.
function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export async function getCatCare(): Promise<CatCare> {
  const rows = await sql`SELECT last_fed, last_watered FROM cat_care WHERE id = 1`;
  const row = rows[0] as { last_fed: Date | null; last_watered: Date | null } | undefined;
  return {
    lastFed: toIso(row?.last_fed ?? null),
    lastWatered: toIso(row?.last_watered ?? null),
  };
}

export async function markFed(): Promise<void> {
  await sql`UPDATE cat_care SET last_fed = now() WHERE id = 1`;
}

export async function markWatered(): Promise<void> {
  await sql`UPDATE cat_care SET last_watered = now() WHERE id = 1`;
}
