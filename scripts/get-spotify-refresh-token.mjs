#!/usr/bin/env node
/*
 * One-time local script to get a Spotify refresh token. Not part of the
 * deployed app, run it once on your own machine and throw it away.
 *
 * Before running:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add "http://127.0.0.1:8888/callback" as a Redirect URI in the app's settings
 *   3. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
 *
 * Run: node scripts/get-spotify-refresh-token.mjs
 * Then open the printed URL, log in, approve access. This script catches
 * the redirect, exchanges the code for tokens, and prints the refresh
 * token to paste into .env.local as SPOTIFY_REFRESH_TOKEN.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

function loadEnvLocal() {
  const env = {};
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match) {
        env[match[1]] = match[2].trim().replace(/^"(.*)"$/, "$1");
      }
    }
  } catch {
    // .env.local doesn't exist yet, that's fine, we'll just find nothing.
  }
  return env;
}

const env = loadEnvLocal();
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local first.");
  process.exit(1);
}

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "user-read-currently-playing";

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", clientId);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPE);

console.log("\nOpen this URL, log in, and approve access:\n");
console.log(authorizeUrl.toString());
console.log("\nWaiting for the redirect...\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing code");
    server.close();
    return;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await tokenRes.json();

  if (!data.refresh_token) {
    console.error("No refresh token in response:", data);
    res.writeHead(500).end("Failed, check the terminal.");
    server.close();
    return;
  }

  console.log("Success. Add this to .env.local (and to Vercel's env vars):\n");
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<p>Done, you can close this tab. Check your terminal for the refresh token.</p>");
  server.close();
});

server.listen(8888);
