#!/usr/bin/env node
// One-time schema setup. Run: node scripts/init-todos-db.mjs
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
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS cat_care (
    id INT PRIMARY KEY DEFAULT 1,
    last_fed TIMESTAMPTZ,
    last_watered TIMESTAMPTZ,
    CHECK (id = 1)
  )
`;

await sql`
  INSERT INTO cat_care (id, last_fed, last_watered)
  VALUES (1, NULL, NULL)
  ON CONFLICT (id) DO NOTHING
`;

await sql`
  CREATE TABLE IF NOT EXISTS gate_attempts (
    id SERIAL PRIMARY KEY,
    ip TEXT,
    user_agent TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS site_status (
    id INT PRIMARY KEY DEFAULT 1,
    status TEXT,
    CHECK (id = 1)
  )
`;

await sql`
  INSERT INTO site_status (id, status)
  VALUES (1, 'Final semester at USF, Smart City Student Volunteer at City of Winter Haven')
  ON CONFLICT (id) DO NOTHING
`;

console.log("todos, cat_care, gate_attempts, and site_status tables ready");
