import { notFound } from "next/navigation";
import { hasValidGateCookie } from "@/lib/privateGate";
import GatePasswordForm from "./GatePasswordForm";
import MonthView from "@/components/calendar/MonthView";

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

  return <MonthView />;
}
