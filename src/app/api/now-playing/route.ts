import { NextResponse } from "next/server";
import { getCurrentlyPlaying } from "@/lib/spotify";

export async function GET() {
  const nowPlaying = await getCurrentlyPlaying();
  return NextResponse.json(
    nowPlaying ?? { isPlaying: false, title: "", artist: "", url: "" },
  );
}
