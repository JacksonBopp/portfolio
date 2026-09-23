#!/usr/bin/env node
// One-time schema setup. Run: node scripts/init-calendar-db.mjs
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^"(.*)"$/, "$1");
    }
  }
}

loadEnvLocal();

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

console.log("events table ready");
