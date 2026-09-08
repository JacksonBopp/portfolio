// Server-only: exchanges the long-lived refresh token for a short-lived
// access token on every call, then asks Spotify what's currently playing.
// The Client Secret and refresh token never reach the browser; only the
// track/artist/link that comes back from getCurrentlyPlaying() does.

export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  url: string;
};

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function getCurrentlyPlaying(): Promise<NowPlaying | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  // 204 = nothing playing right now, not an error.
  if (res.status === 204 || !res.ok) {
    return { isPlaying: false, title: "", artist: "", url: "" };
  }

  const data = await res.json();
  if (!data?.item) {
    return { isPlaying: false, title: "", artist: "", url: "" };
  }

  return {
    isPlaying: Boolean(data.is_playing),
    title: data.item.name ?? "",
    artist: (data.item.artists ?? []).map((a: { name: string }) => a.name).join(", "),
    url: data.item.external_urls?.spotify ?? "",
  };
}
