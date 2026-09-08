import "server-only";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);

export type GateAttempt = {
  id: number;
  ip: string;
  userAgent: string;
  attemptedAt: string; // ISO 8601
};

function mapRow(row: {
  id: number;
  ip: string | null;
  user_agent: string | null;
  attempted_at: Date;
}): GateAttempt {
  return {
    id: row.id,
    ip: row.ip ?? "unknown",
    userAgent: row.user_agent ?? "unknown",
    attemptedAt: row.attempted_at.toISOString(),
  };
}

export async function listRecentAttempts(limit = 20): Promise<GateAttempt[]> {
  const rows = await sql`
    SELECT id, ip, user_agent, attempted_at
    FROM gate_attempts
    ORDER BY attempted_at DESC
    LIMIT ${limit}
  `;
  return rows.map(mapRow as (row: unknown) => GateAttempt);
}

async function countRecentAttempts(windowMs: number): Promise<number> {
  const rows = await sql`
    SELECT count(*)::int AS count FROM gate_attempts
    WHERE attempted_at > now() - (${windowMs}::text || ' milliseconds')::interval
  `;
  return (rows[0] as { count: number }).count;
}

// Logs the attempt to the DB (awaited, so it's reliably recorded before
// the caller returns "wrong password" to the form) and returns a promise
// for the email notification that the caller schedules via next/server's
// after(), so a slow Resend round-trip never delays the login response.
export async function recordFailedAttempt(ip: string, userAgent: string): Promise<() => Promise<void>> {
  await sql`INSERT INTO gate_attempts (ip, user_agent) VALUES (${ip}, ${userAgent})`;

  return async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;

    try {
      const recentCount = await countRecentAttempts(60 * 60 * 1000);
      const escalated = recentCount > 3;
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Portfolio Gate <onboarding@resend.dev>",
        to: "boppjackson@gmail.com",
        subject: escalated
          ? `Repeated wrong password attempts on your private gate (${recentCount} in the last hour)`
          : "Wrong password attempt on your private gate",
        text: `IP: ${ip}\nUser agent: ${userAgent}\nTime: ${new Date().toISOString()}\nAttempts in the last hour: ${recentCount}`,
      });
    } catch {
      // Don't let a Resend/network hiccup break the login flow.
    }
  };
}
