import "server-only";
import { sql } from "./db";

const FALLBACK_STATUS = "Final semester at USF, Smart City Student Volunteer at City of Winter Haven";

export async function getStatus(): Promise<string> {
  const rows = await sql`SELECT status FROM site_status WHERE id = 1`;
  const row = rows[0] as { status: string | null } | undefined;
  return row?.status || FALLBACK_STATUS;
}

export async function setStatus(status: string): Promise<void> {
  await sql`
    INSERT INTO site_status (id, status) VALUES (1, ${status})
    ON CONFLICT (id) DO UPDATE SET status = ${status}
  `;
}
