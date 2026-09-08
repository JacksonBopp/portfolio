import Link from "next/link";
import { Kalam } from "next/font/google";
import { notFound } from "next/navigation";
import { hasValidGateCookie } from "@/lib/privateGate";
import GatePasswordForm from "./GatePasswordForm";
import PrivateArea from "@/components/private/PrivateArea";

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function GatePage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  const { gate } = await params;

  const secretPath = process.env.PRIVATE_GATE_PATH;
  if (!secretPath || gate !== secretPath) {
    notFound();
  }

  const authed = await hasValidGateCookie();
  if (!authed) {
    return <GatePasswordForm />;
  }

  return (
    <div className={`${kalam.variable} min-h-screen bg-[var(--bg-0)] p-6 text-[var(--fg)]`}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link href="/" className="w-fit font-mono-tech text-xs text-[var(--fg-dim)] hover:text-[var(--amber)]">
          ← Back to console
        </Link>

        <PrivateArea />
      </div>
    </div>
  );
}
