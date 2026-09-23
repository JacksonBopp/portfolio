import { NextResponse } from "next/server";
import { getStatus } from "@/lib/siteStatus";

// Public and read-only: this is exactly the text already shown on the
// public Overview page, just fetched live instead of baked into a static
// data file. Editing it requires the private area's authenticated Server
// Action, not this route.
export async function GET() {
  const status = await getStatus();
  return NextResponse.json({ status });
}
