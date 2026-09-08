import { redirect } from "next/navigation";

// The literal secret path never appears in any client-shipped code, only
// this fixed, publicly-visible endpoint name does. The server reads the
// real destination from an environment variable at request time.
export async function GET() {
  const secretPath = process.env.PRIVATE_GATE_PATH;
  if (!secretPath) {
    redirect("/");
  }
  redirect(`/${secretPath}`);
}
